
````markdown
# CircuitIQ

CircuitIQ is a mobile electrical field assistant being developed for electricians, technicians, engineers, and field-service professionals.

The project combines a React Native mobile application with Firebase Authentication and a NestJS backend using Prisma and PostgreSQL. Planned capabilities include equipment identification, asset management, inspections, work orders, and AI-assisted information extraction.

**Status:** Active development. Authentication and the backend foundation are implemented; company authorization and mobile-to-backend integration are next.

## Project Goal

CircuitIQ aims to bring electrical equipment information and field workflows into one organized workspace.

The planned equipment-scanning workflow is:

**Scan → OCR → Review → Confirm**

Users will review and confirm extracted information before it becomes approved asset data. AI-generated results will support the technician's work rather than automatically establish verified equipment information.

## Development Progress

| Area | Current Progress |
|---|---|
| Mobile foundation | React Native, Expo, TypeScript, and Expo Router configured |
| Authentication | Firebase email/password login, persistent sessions, protected routes, and sign-out |
| Dashboard | Interface built with metric cards, recent activity, and navigation placeholders |
| Backend | NestJS application with health and database-readiness endpoints |
| Database | PostgreSQL development database running through Docker Compose |
| Prisma | Schema, generated client integration, and initial Organization migration |
| Documentation | Changelog, version registry, and editable backend class diagram |
| Integration | Mobile dashboard is not yet connected to the backend |

### Branch Availability

- **`main`** contains the merged mobile and authentication foundation.
- **`feature/backend-foundation`** contains the dashboard interface and NestJS–Prisma–PostgreSQL foundation.

The backend setup instructions below require the backend foundation branch.

Dashboard counts and activity entries are currently placeholders. Most dashboard actions display a message indicating that the feature is not yet implemented.

## Technology

| Technology | Role |
|---|---|
| React Native | Mobile application framework |
| Expo | Mobile development tooling and application configuration |
| React | Component-based user interface |
| TypeScript | Static typing across mobile and backend code |
| Expo Router | Screen navigation and protected routes |
| Firebase Authentication | Email/password authentication and session management |
| NestJS | Backend API structure and application logic |
| Prisma | Database access and schema migrations |
| PostgreSQL | Relational application database |
| Docker Compose | Local PostgreSQL environment |
| Vitest | Backend automated testing |
| Git and GitHub | Version control, branches, and development history |

Dependency declarations and lockfiles are maintained separately for the mobile application and backend.

See [VERSIONS.md](VERSIONS.md) for the recorded development environment and [CHANGELOG.md](CHANGELOG.md) for implementation history.

## Development Environment

| Tool | Configuration |
|---|---|
| Primary editor | Cursor |
| Mobile development tools | Android Studio, Android SDK, and ADB |
| Primary test device | Pixel 7 Android Virtual Device |
| Android environment | Android 17 |
| JavaScript runtime | Node.js 24 |
| Local database environment | Docker Desktop and PostgreSQL 17 |

## Application Architecture

### Mobile Application

The mobile application handles:

- Login form validation and authentication feedback.
- Firebase sign-in and sign-out.
- Authentication state through `AuthContext`.
- Persistent authentication sessions.
- Protected navigation through Expo Router.
- Dashboard presentation and user interaction.

### Backend

The backend currently contains five application classes:

| Class | Responsibility |
|---|---|
| `AppModule` | Registers application modules, providers, and the controller |
| `AppController` | Defines the HTTP endpoints |
| `AppService` | Implements starter, health, and readiness responses |
| `PrismaModule` | Provides and exports the shared database service |
| `PrismaService` | Extends Prisma Client and handles connection initialization and cleanup |

A database-readiness request follows this path:

**HTTP request → AppController → AppService → PrismaService → PostgreSQL**

The mobile application does not yet send authenticated requests to this backend.

### Database

The initial `Organization` model represents a company using CircuitIQ.

| Field | Purpose |
|---|---|
| `id` | Unique organization identifier |
| `name` | Company name |
| `createdAt` | Creation timestamp |
| `updatedAt` | Timestamp maintained by Prisma when a record is updated |

Employee memberships, roles, assets, inspections, and work orders will be added through future schema changes.

## Backend Endpoints

These endpoints are available on the backend foundation branch:

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Returns the starter message |
| GET | `/health` | Confirms the running API responds |
| GET | `/ready` | Queries the Organization table to check database access |

Successful health response:

```json
{
  "status": "ok",
  "service": "CircuitIQ API"
}
```

Successful readiness response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

A failed readiness query returns HTTP 503. An empty Organization table is a valid result and does not cause readiness to fail.

## Installation and Running

The following commands use PowerShell.

### Prerequisites

- Git.
- Node.js 24 and npm.
- Android Studio with the Android SDK and emulator tools.
- Java JDK 17 for the documented Android development environment.
- A configured Pixel 7 AVD.
- Firebase project configuration and an enabled email/password sign-in provider.
- An existing Firebase test account.
- Docker Desktop when running the backend.

### 1. Clone the Repository

```powershell
git clone https://github.com/mhoffman4934/CircuitIQ-Electrical-Field-Assistant-Development.git CircuitIQ
cd CircuitIQ
```

Repository access is required if the repository is private.

To work with the dashboard and backend foundation:

```powershell
git switch feature/backend-foundation
```

### 2. Install Mobile Dependencies

From the repository root:

```powershell
npm ci
```

### 3. Configure Firebase

For a new local setup, copy the mobile environment template:

```powershell
Copy-Item .env.example .env
```

If `.env` already exists, update it rather than overwriting it.

Populate the variables with the Firebase configuration for your development project:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

These variables configure the Firebase client application. Values prefixed with `EXPO_PUBLIC_` are included in the client bundle and must not contain private server credentials.

The mobile application currently supports sign-in with an existing account. Company-managed employee provisioning is planned.

### 4. Start the Android Emulator

Open Android Studio and launch the Pixel 7 AVD.

Confirm that ADB detects the emulator:

```powershell
adb devices
```

The emulator should appear with the status `device`.

### 5. Start the Mobile Application

From the repository root:

```powershell
npm start
```

Press **a** in the Expo terminal to open the application on Android.

Alternatively:

```powershell
npm run android
```

### 6. Set Up the Backend

On `feature/backend-foundation`, open a second terminal and enter the server directory:

```powershell
cd server
npm ci
```

For a new setup:

```powershell
Copy-Item .env.example .env
```

Configure the server environment:

```dotenv
POSTGRES_USER=circuitiq_dev
POSTGRES_PASSWORD=replace_me
POSTGRES_DB=circuitiq
DATABASE_URL="postgresql://circuitiq_dev:replace_me@127.0.0.1:5432/circuitiq?schema=public"
```

Replace both password placeholders with matching values. Percent-encode special characters in the URL password when necessary.

Keep the documented username and database name because the current Compose configuration uses those names.

With Docker Desktop running:

```powershell
docker compose up -d
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run build
npm run start:dev
```

The default API address is:

```text
http://localhost:3000
```

Check:

- [API health](http://localhost:3000/health)
- [Database readiness](http://localhost:3000/ready)

The root `.env` configures the mobile application. `server/.env` configures the backend and local database.

## Verification and Testing

### Mobile TypeScript Check

Run from the repository root:

```powershell
npx tsc --noEmit
```

### Backend Checks

Run from `server`:

```powershell
npm run build
npm run lint
npm test
npx prisma validate --config prisma7.config.ts
```

The current controller unit test verifies the starter response using a mocked Prisma service. It does not verify all API behavior or establish a real database connection.

The existing end-to-end test can be run with:

```powershell
npm run test:e2e
```

It initializes the real application and requires the server environment, generated Prisma Client, and a reachable PostgreSQL database.

During development, the backend build, starter unit test, migration, client generation, and browser health/readiness checks have been verified. Broader automated coverage and continuous integration are planned.

## Security and Configuration

- Firebase handles user passwords and authentication.
- Mobile route protection controls which screens are accessible through the app.
- Backend Firebase token verification and organization authorization are not yet implemented.
- Future company-data endpoints must validate identity and organization membership on the server.
- Database credentials, service-account private keys, and other server secrets must remain outside version control and the mobile bundle.
- Environment templates use placeholder values.
- Generated Prisma files, dependencies, and build output are excluded from Git.
- The local PostgreSQL port is bound to `127.0.0.1`.

An authenticated Firebase account will not automatically imply permission to access a company's data. That authorization will be enforced by the backend.

## Engineering Concepts Demonstrated

- Component-based mobile application development.
- TypeScript types and interfaces.
- Authentication state management.
- Protected application navigation.
- Separation between controllers, application services, and database access.
- NestJS dependency injection and lifecycle hooks.
- Relational database modeling and schema migrations.
- Environment-based configuration.
- Docker-based local development.
- Unit testing with mocked dependencies.
- Git branching and incremental commits.
- UML documentation and development records.

## Progress Notes

CircuitIQ has helped me understand how a mobile application works beyond its interface. Building the login flow taught me how authentication state, navigation, session persistence, and error handling work together.

Developing the dashboard helped me organize reusable interface elements and distinguish presentation code from the data and workflows that will eventually support it.

The backend foundation introduced a second part of the application: a NestJS API connected to PostgreSQL through Prisma. Implementing the health and readiness endpoints helped me trace a request from an HTTP route through a service to a database query.

I have also practiced dependency injection, environment configuration, database migrations, Docker containers, and testing with a mocked database service.

Git and GitHub have supported this process through feature branches, incremental commits, documentation updates, and repository reviews. The next stage is connecting these foundations into an authenticated, company-aware application.

## Future Plans

### 1. Complete the Backend Foundation Checkpoint

- Finalize the backend setup documentation.
- Correct version records and documentation formatting.
- Add tests for health and readiness success and failure responses.
- Improve formatting consistency and repeatable development checks.
- Review the completed branch before merging it into `main`.

### 2. Add Users and Organization Memberships

- Create backend user records linked to Firebase UIDs.
- Connect users to organizations through membership records.
- Define initial employee roles and active-access status.
- Continue using Firebase for password handling.

### 3. Verify Firebase Tokens in NestJS

- Send Firebase ID tokens with mobile API requests.
- Verify tokens on the backend.
- Protect endpoints that require an authenticated user.

### 4. Enforce Company-Managed Access

- Require an active organization membership before returning company data.
- Enforce role-based permissions where needed.
- Provision a development organization and employee for initial testing.
- Add an administrator-managed invitation and access workflow later.

### 5. Connect the First Authenticated Mobile Feature

- Create a protected `GET /me` endpoint.
- Return the employee's profile, organization, and role.
- Connect the mobile application to the endpoint.
- Replace dashboard name and company placeholders with backend data.

### 6. Implement Company-Owned Assets

- Add the Asset model and organization relationship.
- Create endpoints for listing, viewing, and creating assets.
- Enforce organization access on every asset operation.
- Replace the dashboard's asset count with a real database result.

### 7. Build Field Workflows

- Add inspections and work orders.
- Connect dashboard summaries and recent activity to backend data.
- Implement equipment scanning and OCR.
- Present extracted information for user review and correction.
- Save approved information after explicit confirmation.

The intended workflow remains:

**Scan → OCR → Review → Confirm**

---

## YouTube

-Project updates and development progress are posted on Youtube:

- [Marcin Hoffman — Computer Science YouTube Channel](https://www.youtube.com/@MarcinHoffman-CS)

---

## LinkedIn

Project updates and development progress are also posted on LinkedIn:

- [Marcin Hoffman — LinkedIn](https://www.linkedin.com/in/marcin-hoffman-935423282/)
````
