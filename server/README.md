# CircuitIQ Backend

The NestJS API for CircuitIQ, an electrical field assistant built with React Native and Expo.

This backend currently provides API health checks and a PostgreSQL database foundation. Firebase token verification, company memberships, and field-work APIs are planned next.

## Technology

| Component | Purpose |
|---|---|
| NestJS | Organizes HTTP endpoints, application logic, and dependency injection |
| TypeScript | Provides static typing for backend code |
| PostgreSQL 17 | Stores application data |
| Prisma 7 | Provides database query methods and schema migrations |
| Docker Compose | Runs the local PostgreSQL database |
| Vitest | Runs automated tests |

Exact dependency versions are recorded in `package-lock.json`. The repository's `VERSIONS.md` contains additional environment information.

## Current Features

- `GET /` starter endpoint.
- `GET /health` API health endpoint.
- `GET /ready` database readiness endpoint.
- Local PostgreSQL container with persistent storage.
- Organization database model and initial migration.
- Shared Prisma service with connection lifecycle handling.
- Environment-variable configuration.
- Starter controller unit test with a mocked database service.

## Project Structure

```text
server/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts
├── .env.example
├── compose.yaml
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── vitest.config.ts
└── vitest.config.e2e.ts
```

Prisma Client is generated into `src/generated/prisma/`. Generated files are excluded from Git.

## Prerequisites

- Node.js 24 and npm.
- Docker Desktop with Linux containers available.
- A local copy of the CircuitIQ repository.
- Port `3000` available for the API.
- Port `5432` available for PostgreSQL.

The following commands use PowerShell and should be run from the `server` directory.

From the repository root:

```powershell
cd server
```

## Local Setup

### 1. Install dependencies

```powershell
npm ci
```

This installs the dependency versions recorded in the server lockfile.

### 2. Configure environment variables

For the initial setup, create the server's local environment file:

```powershell
Copy-Item .env.example .env
```

If `.env` already exists, keep it and check its settings instead of overwriting it.

The file should contain:

```dotenv
POSTGRES_USER=circuitiq_dev
POSTGRES_PASSWORD=replace_me
POSTGRES_DB=circuitiq
DATABASE_URL="postgresql://circuitiq_dev:replace_me@127.0.0.1:5432/circuitiq?schema=public"
```

Replace both occurrences of `replace_me` with the same local database password.

If the password contains characters with special meaning in a URL, percent-encode them in `DATABASE_URL`. Keep the original password in `POSTGRES_PASSWORD`.

Keep `POSTGRES_USER` and `POSTGRES_DB` set to the values above because the current Compose configuration uses those names.

The backend uses `server/.env`. The mobile application's Firebase configuration belongs in the separate environment file at the repository root.

Do not commit actual credentials.

### 3. Start PostgreSQL

Make sure Docker Desktop is running, then execute:

```powershell
docker compose up -d
```

Check the container:

```powershell
docker compose ps
```

PostgreSQL should be running and become healthy.

### 4. Apply database migrations

```powershell
npx prisma migrate deploy --config prisma7.config.ts
```

This applies the committed migrations, including the initial Organization table.

### 5. Generate Prisma Client

```powershell
npx prisma generate --config prisma7.config.ts
```

Generate the client before building the backend and after changing the Prisma schema.

### 6. Build and start the API

```powershell
npm run build
```

```powershell
npm run start:dev
```

The development server watches for source-code changes.

The default API address is:

```text
http://localhost:3000
```

The API port can be changed by setting `PORT` in the server environment.

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Returns the starter message |
| GET | `/health` | Confirms the running API can respond |
| GET | `/ready` | Checks database access by querying the Organization table |


### GET /health

Successful response: HTTP 200.

```json
{
  "status": "ok",
  "service": "CircuitIQ API"
}
```

This endpoint does not perform a database query.

### GET /ready

Successful response: HTTP 200.

```json
{
  "status": "ok",
  "database": "connected"
}
```

If the database query fails, the running API returns HTTP 503:

```json
{
  "status": "error",
  "database": "disconnected"
}
```

An empty Organization table is valid. The readiness check does not create or modify records.

The application also attempts to connect to PostgreSQL during startup. A startup connection failure can prevent the API from becoming available.

## Backend Classes

| Class | Responsibility |
|---|---|
| `AppModule` | Registers the controller, application service, configuration, and Prisma module |
| `AppController` | Defines the HTTP routes and delegates requests to `AppService` |
| `AppService` | Implements the starter, health, and readiness responses |
| `PrismaModule` | Provides and exports the shared `PrismaService` |
| `PrismaService` | Extends Prisma Client and manages database connection initialization and cleanup |

The readiness request follows this path:

```text
HTTP request → AppController → AppService → PrismaService → PostgreSQL
```

The editable class diagram is located in the repository's `UML Diagrams` directory.

## Organization Model

An organization represents a company using CircuitIQ.

| Field | Type | Purpose |
|---|---|---|
| `id` | String | Primary key with a Prisma-generated CUID default |
| `name` | String | Company name |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Timestamp maintained by Prisma when updating a record |

The current model does not yet contain employee memberships or relationships to assets, inspections, or work orders.

An organization record alone does not enforce access control.

## Development Checks

Run these commands from `server`.

### Compile the backend

```powershell
npm run build
```

### Run unit tests

```powershell
npm test
```

The current unit test checks the starter controller response. It uses a mocked `PrismaService` and does not connect to PostgreSQL.

Prisma Client must still be generated because the test imports the Prisma service.

### Run end-to-end tests

```powershell
npm run test:e2e
```

The current end-to-end test checks `GET /`. It initializes the real application, so it requires a configured environment, generated Prisma Client, and a reachable PostgreSQL database.

### Run lint checks

```powershell
npm run lint
```

### Validate the Prisma schema

```powershell
npx prisma validate --config prisma7.config.ts
```

## Database Changes

After intentionally modifying `prisma/schema.prisma`, create a development migration:

```powershell
npx prisma migrate dev --name describe_change --config prisma7.config.ts
```

Then regenerate Prisma Client:

```powershell
npx prisma generate --config prisma7.config.ts
```

Commit the schema and migration files. Do not commit the generated client.

Use `migrate deploy` when applying existing committed migrations to another environment.

## Stopping Local Services

Stop the API with **Ctrl+C** in its terminal.

Stop PostgreSQL with:

```powershell
docker compose stop
```

The database uses a named Docker volume, so stopping the container preserves its data.

Changing credentials in `.env` does not automatically change credentials inside an already initialized PostgreSQL volume.

## Troubleshooting

| Problem | Check |
|---|---|
| `DATABASE_URL` is missing | Confirm `server/.env` exists and start the API from `server` |
| PostgreSQL connection fails | Check Docker Desktop, `docker compose ps`, and matching credentials |
| Generated Prisma import is missing | Run the Prisma generation command |
| Organization table is missing | Apply the committed migrations |
| Port is already in use | Stop the conflicting process or update the relevant port configuration |
| Docker container fails to start | Run `docker compose logs postgres` |

## Current Scope

The mobile application already uses Firebase Authentication. Backend verification of Firebase ID tokens has not yet been implemented.

The backend currently exposes only the starter and health/readiness endpoints. It does not yet provide:

- Employee memberships and organization roles.
- Organization-level authorization.
- Asset, inspection, or work-order endpoints.
- Dashboard queries.
- Scan, OCR, review, and confirmation endpoints.

Future company-data endpoints must verify the caller's identity and organization access on the server.
