const { test } = require('node:test');
const assert = require('node:assert/strict');
const { FirebaseAuthGuard } = require('../dist/auth');
const { ValidationPipe } = require('@nestjs/common');
const { CreateAssetDto, CreateWorkspaceDto, PageQuery } = require('../dist/dto');

const context = headers => {
  const req = { headers };
  return { req, switchToHttp: () => ({ getRequest: () => req }) };
};

test('missing and malformed authorization never reaches the verifier', async () => {
  const guard = new FirebaseAuthGuard({ verify() { throw new Error('must not be called'); } });
  for (const authorization of [undefined, '', 'Basic value', 'Bearer', 'Bearer a b']) {
    await assert.rejects(guard.canActivate(context({ authorization })), error => error.getStatus() === 401);
  }
});

test('expired, revoked, disabled and invalid Firebase tokens are rejected', async () => {
  for (const code of ['auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled', 'auth/argument-error']) {
    const guard = new FirebaseAuthGuard({ async verify() { throw Object.assign(new Error('private detail'), { code }); } });
    await assert.rejects(guard.canActivate(context({ authorization: 'Bearer invalid' })), error => {
      assert.equal(error.getStatus(), 401);
      assert.ok(!error.message.includes('private detail'));
      return true;
    });
  }
});

test('the verified identity, not client input, becomes the request identity', async () => {
  const guard = new FirebaseAuthGuard({ async verify(token) { assert.equal(token, 'signed-token'); return { uid: 'verified-user' }; } });
  const ctx = context({ authorization: 'Bearer signed-token' });
  assert.equal(await guard.canActivate(ctx), true);
  assert.equal(ctx.req.identity.uid, 'verified-user');
});

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });
test('asset tags are normalized and client tenant fields rejected', async () => {
  const body = { siteId: '00000000-0000-4000-8000-000000000001', name: ' Panel ', assetTag: ' panel-a ' };
  const result = await pipe.transform(body, { type: 'body', metatype: CreateAssetDto });
  assert.equal(result.assetTag, 'PANEL-A');
  assert.equal(result.name, 'Panel');
  await assert.rejects(pipe.transform({ ...body, organizationId: 'foreign' }, { type: 'body', metatype: CreateAssetDto }));
  await assert.rejects(pipe.transform({ ...body, name: '   ' }, { type: 'body', metatype: CreateAssetDto }));
});

test('workspace names cannot be blank or oversized', async () => {
  for (const name of ['', '  ', 'x'.repeat(121)]) {
    await assert.rejects(pipe.transform({ name, siteName: 'Main' }, { type: 'body', metatype: CreateWorkspaceDto }));
  }
});

test('pagination rejects invalid bounds and fractional pages', async () => {
  for (const page of ['0', '-1', '1.5', 'oops', '100001']) {
    await assert.rejects(pipe.transform({ page }, { type: 'query', metatype: PageQuery }));
  }
  const result = await pipe.transform({}, { type: 'query', metatype: PageQuery });
  assert.equal(result.page, 1);
  assert.equal(result.search, '');
});
