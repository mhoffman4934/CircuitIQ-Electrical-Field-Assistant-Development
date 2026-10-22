# CircuitIQ API — dashboard and assets foundation

This is the first live-data slice of CircuitIQ: Firebase login → NestJS API → Prisma → PostgreSQL. It adds workspace setup, asset creation/list/detail, organization isolation, and a dashboard count/activity feed. It does not implement OCR, inspections, work orders, team invitations, asset edits/deletion, or deployment.

## What each layer owns

| Layer | Responsibility |
| --- | --- |
| Expo app | Screens, forms, loading/error states, and authenticated HTTP requests |
| Firebase Auth | Account sign-in and ID tokens; existing login stays in place |
| NestJS | Verify tokens, validate input, authorize organization access, execute workflows |
| Prisma | Typed queries, transactions, schema and versioned SQL migrations |
| PostgreSQL | Durable records, uniqueness constraints and relationships |

The app sends a Firebase ID token in `Authorization: Bearer ...`. NestJS verifies its signature, expiry, revocation, and disabled-account status. The verified UID resolves the server-managed membership. Clients never select an organization by submitting an organization ID.

Each account can create one workspace and initial site in this first version. Organization membership is a separate table so team access can be added later with an explicit invitation/role policy. Creating a workspace does not invite other users. Assets and activity belong to the organization; composite foreign keys prevent an asset from referencing another organization's site. Asset creation and activity recording are one transaction.

## Start locally (Cursor / Windows PowerShell)

Requires Node.js 24+, Docker Desktop running Linux containers (or an existing PostgreSQL server), and the existing Firebase project with Email/Password authentication.

From the repository root:

```powershell
cd server
npm ci
Copy-Item .env.example .env
docker compose up -d
```

Edit `server/.env`:

- The supplied `DATABASE_URL` matches the local Docker database. Its password is for local development only; the database port is bound to localhost.
- Set `FIREBASE_PROJECT_ID` to the same project used by your existing mobile Firebase configuration.
- In Firebase Console → Project settings → Service accounts, generate an Admin SDK private key if you do not already have one. Keep it **outside this repository**. Set `GOOGLE_APPLICATION_CREDENTIALS` to its absolute path, using forward slashes on Windows, such as `C:/Users/YourName/.circuitiq/firebase-admin.json`. Do not paste or commit its contents.
- A deployment with Google Application Default Credentials can omit the key-file setting.

Then:

```powershell
npm run db:migrate
npm run build
npm start
```

`http://localhost:3000/api/health` should return `{"status":"ok"}`. This is a process-liveness check; successful authenticated asset operations confirm database and Firebase connectivity. The app fails at startup if required configuration is absent or the database cannot connect.

For development, run `npx tsc --watch` in one server terminal after the initial build, and `npm run dev` in another. The latter watches compiled JavaScript.

## Connect the mobile app

In the **root** `.env`, keep the existing `EXPO_PUBLIC_FIREBASE_*` values and add:

```dotenv
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

`10.0.2.2` reaches the host computer from the Android emulator. For your physical Pixel 7, use your computer's LAN IP instead; both devices must be on the same network and the local firewall must allow port 3000 on that private network. Use HTTPS for a deployed API. Server credentials and `DATABASE_URL` must never appear in `EXPO_PUBLIC_*` variables.

In a terminal at the repository root:

```powershell
npm ci
npm start -- --clear
```

Sign in → **Set up workspace** → enter organization and first site → **Add equipment** → save an asset. Open the asset details, then return to Home. The count and activity should refresh from PostgreSQL. Pull down on Home to refresh manually. Search the Assets screen by name or tag.

If a POST times out, refresh the dashboard or asset list before retrying: the server may have completed the save even if the response was lost. Asset tags are normalized to uppercase and unique per organization, preventing duplicate records with the same tag.

## Endpoints

All paths start with `/api`; all except health require a Firebase bearer token.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/health` | Process liveness |
| GET | `/me` | Verified account identity |
| POST | `/workspace` | Create one organization, membership and initial site |
| GET | `/dashboard` | Workspace, actual asset count and latest 10 activities |
| GET | `/assets?page=1&search=panel` | 25 assets per page, scoped search and total |
| POST | `/assets` | Create asset and activity atomically |
| GET | `/assets/:id` | Scoped asset detail; foreign records return 404 |

Workspace body: `{"name":"Example Electric","siteName":"Main site"}`.

Asset body: `{"siteId":"site-uuid","assetTag":"PANEL-001","name":"Main panel"}`. Optional fields: `manufacturer`, `model`, `serialNumber`, `notes`. Required text is trimmed and nonempty. Unknown fields are rejected. An equipment record is not an inspection or a safety assessment; Last Inspection Date stays “Not recorded.”

## Verification

```powershell
# From server/
npm run lint
npm run typecheck
npm test

# From the repository root
npm run lint
npx tsc --noEmit
```

The unit tests cover auth rejection, verified identity, DTO validation and pagination. Integration tests use real PostgreSQL, Prisma and Nest HTTP routes with **only Firebase token verification mocked**. To run them on a disposable database:

```powershell
# From server/ with the local Docker database running
docker compose exec postgres createdb -U circuitiq circuitiq_test
$env:TEST_DATABASE_URL="postgresql://circuitiq:circuitiq_local@localhost:5432/circuitiq_test"
$env:DATABASE_URL=$env:TEST_DATABASE_URL
npm run db:migrate
npm run test:integration
Remove-Item Env:DATABASE_URL
Remove-Item Env:TEST_DATABASE_URL
```

The database name must end in `_test`. Tests create uniquely identified records; they do not reset or delete an existing database. They check concurrent setup, organization isolation across list/detail/dashboard, foreign site rejection, duplicate tags, search, and rollback of an asset when activity creation fails.

Actual Firebase credentials and a Pixel 7/emulator session are still needed for the final device smoke test. No cloud service has been deployed by this change.

## Next backend slices

1. Inspection records and Last Inspection Date.
2. Work orders and due/open dashboard totals.
3. Scan → OCR → Review → Confirm, with explicit user confirmation before record updates.
4. Team invitations and organization roles.

SQLite and offline persistence remain out of scope.
