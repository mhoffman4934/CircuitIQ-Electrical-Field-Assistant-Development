// Real PostgreSQL + Prisma + Nest HTTP tests. Only token verification is mocked.
// Run against a migrated, disposable database whose name ends in _test.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const request = require('supertest');
const { Test } = require('@nestjs/testing');
const { AppModule } = require('../dist/app.module');
const { FirebaseTokenVerifier } = require('../dist/auth');
const { PrismaService } = require('../dist/prisma.service');
const { configure } = require('../dist/configure');

test('authenticated workspace and asset lifecycle against PostgreSQL', async t => {
  const url = process.env.TEST_DATABASE_URL;
  assert.ok(url && new URL(url).pathname.endsWith('_test'), 'TEST_DATABASE_URL must point to a disposable database ending in _test');
  process.env.DATABASE_URL = url;
  const run = randomUUID();
  const identity = token => `${run}-${token}`;
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(FirebaseTokenVerifier).useValue({
      async verify(token) {
        if (!['alice', 'bob', 'new', 'race'].includes(token)) throw new Error('invalid');
        return { uid: identity(token), email: `${token}@example.test` };
      },
    }).compile();
  const app = module.createNestApplication();
  configure(app);
  await app.init();
  t.after(() => app.close());
  const http = request(app.getHttpServer());
  const auth = token => ({ Authorization: `Bearer ${token}` });
  let aliceWorkspace, bobWorkspace, asset;

  await t.test('health is public; dashboard rejects missing or invalid tokens', async () => {
    await http.get('/api/health').expect(200);
    await http.get('/api/dashboard').expect(401);
    await http.get('/api/dashboard').set(auth('bad')).expect(401);
  });
  await t.test('first login returns a truthful empty state and blocks assets until setup', async () => {
    const response = await http.get('/api/dashboard').set(auth('alice')).expect(200);
    assert.equal(response.body.workspace, null);
    await http.get('/api/assets').set(auth('alice')).expect(403);
  });
  await t.test('workspace setup persists separate organizations and sites', async () => {
    aliceWorkspace = (await http.post('/api/workspace').set(auth('alice')).send({ name: 'Alice Electric', siteName: 'Main' }).expect(201)).body;
    bobWorkspace = (await http.post('/api/workspace').set(auth('bob')).send({ name: 'Bob Electric', siteName: 'Other' }).expect(201)).body;
    assert.notEqual(aliceWorkspace.id, bobWorkspace.id);
    await http.post('/api/workspace').set(auth('alice')).send({ name: 'Duplicate', siteName: 'Duplicate' }).expect(409);
  });
  await t.test('concurrent workspace setup creates exactly one organization', async () => {
    const responses = await Promise.all([1, 2].map(() => http.post('/api/workspace').set(auth('race')).send({ name: 'Race', siteName: 'Race' })));
    assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
    const db = app.get(PrismaService);
    assert.equal(await db.membership.count({ where: { userId: identity('race') } }), 1);
  });
  await t.test('clients cannot forge an organization or attach a foreign site', async () => {
    const input = { name: 'Panel', assetTag: 'P-01', siteId: aliceWorkspace.sites[0].id };
    await http.post('/api/assets').set(auth('alice')).send({ ...input, organizationId: bobWorkspace.id }).expect(400);
    await http.post('/api/assets').set(auth('alice')).send({ ...input, siteId: bobWorkspace.sites[0].id }).expect(404);
  });
  await t.test('saving an asset also saves exactly one activity record', async () => {
    asset = (await http.post('/api/assets').set(auth('alice')).send({ name: 'Main panel', assetTag: ' p-01 ', siteId: aliceWorkspace.sites[0].id }).expect(201)).body;
    assert.equal(asset.assetTag, 'P-01');
    const summary = (await http.get('/api/dashboard').set(auth('alice')).expect(200)).body;
    assert.equal(summary.assetCount, 1);
    assert.equal(summary.recentActivity.length, 1);
    assert.equal(summary.recentActivity[0].asset.id, asset.id);
  });
  await t.test('duplicate tags return a conflict without adding an activity', async () => {
    await http.post('/api/assets').set(auth('alice')).send({ name: 'Other panel', assetTag: 'p-01', siteId: aliceWorkspace.sites[0].id }).expect(409);
    const summary = (await http.get('/api/dashboard').set(auth('alice')).expect(200)).body;
    assert.equal(summary.assetCount, 1);
    assert.equal(summary.recentActivity.length, 1);
  });
  await t.test('asset detail, list, and dashboard isolate organizations', async () => {
    await http.get(`/api/assets/${asset.id}`).set(auth('bob')).expect(404);
    await http.get(`/api/assets/${asset.id}`).set(auth('alice')).expect(200);
    assert.equal((await http.get('/api/assets').set(auth('bob')).expect(200)).body.total, 0);
    const summary = (await http.get('/api/dashboard').set(auth('bob')).expect(200)).body;
    assert.equal(summary.assetCount, 0);
    assert.deepEqual(summary.recentActivity, []);
  });
  await t.test('tag uniqueness is per organization', async () => {
    await http.post('/api/assets').set(auth('bob')).send({ name: 'Bob panel', assetTag: 'P-01', siteId: bobWorkspace.sites[0].id }).expect(201);
  });
  await t.test('search and pagination are validated and return scoped results', async () => {
    const response = await http.get('/api/assets?search=MAIN&page=1').set(auth('alice')).expect(200);
    assert.equal(response.body.total, 1);
    assert.equal(response.body.items[0].id, asset.id);
    assert.equal((await http.get('/api/assets?page=2').set(auth('alice')).expect(200)).body.items.length, 0);
    await http.get('/api/assets?page=0').set(auth('alice')).expect(400);
    await http.get('/api/assets/not-a-uuid').set(auth('alice')).expect(400);
  });
  await t.test('failed activity writes roll back the asset transaction', async () => {
    const db = app.get(PrismaService);
    const { AssetsService } = require('../dist/assets.service');
    const service = new AssetsService(db, { async organizationId() { return aliceWorkspace.id; } });
    await assert.rejects(service.create('nonexistent-actor', { name: 'Rollback', assetTag: 'ROLLBACK', siteId: aliceWorkspace.sites[0].id }));
    assert.equal(await db.asset.count({ where: { organizationId: aliceWorkspace.id, assetTag: 'ROLLBACK' } }), 0);
  });
});
