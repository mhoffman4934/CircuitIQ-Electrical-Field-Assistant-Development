# Changelog

All notable changes to CircuitIQ will be documented in this file.

## [Unreleased] — Backend Foundation
### Updated: 2026-10-27
### Branch: feature/backend-foundation

### Added
- NestJS backend application in the server directory.
- GET /health endpoint for checking API availability.
- GET /ready endpoint for checking database access through Prisma.
- PostgreSQL 17 development database managed through Docker Compose.
- Persistent Docker volume and PostgreSQL container health check.
- Prisma configuration, schema, and initial Organization migration.
- Organization model with id, name, createdAt, and updatedAt fields.
- PrismaService for database access and connection lifecycle management.
- PrismaModule for sharing PrismaService across backend modules.
- Server environment-variable template in .env.example.
- Class UML documentation in the UML Diagrams directory.

### Changed
- Configured NestJS to load server environment variables.
- Updated AppService to query PostgreSQL for database readiness.
- Updated AppController to expose the readiness endpoint.
- Enabled application shutdown hooks for database connection cleanup.
- Updated the starter controller test with a mock PrismaService.
- Excluded the server directory from the mobile TypeScript project.
- Added Git ignore rules for server credentials, generated Prisma code,
  build output, and assistant files created during Prisma initialization.
- Removed the root README from this branch.

### Dependencies
- Added Prisma CLI, Prisma Client, the PostgreSQL adapter, dotenv,
  and @nestjs/config.
- Removed the unused @nestjs/mau deployment dependency.
- Applied compatible dependency updates and a Multer 2.5.0 override
  to address the reported dependency vulnerability.

### Verification
- Backend build passed.
- Mobile TypeScript check passed during backend setup.
- Starter controller unit test passed: 1 test.
- Prisma schema validation passed.
- Organization migration applied successfully.
- Prisma Client generation completed successfully.
- Prisma CLI database connection test passed.
- API health and database readiness checks passed in the browser.
- npm audit reported 0 vulnerabilities at the dependency checkpoint.


## [0.2.0] - Authentication Foundation

### Added

- Firebase Authentication integration
- Email and password authentication
- Firebase initialization through `lib/firebase.ts`
- Application-wide authentication state through `AuthContext`
- Persistent authentication sessions using AsyncStorage
- Protected application routes using Expo Router
- Firebase authentication error handling
- Login loading state
- Firebase sign-out functionality
- Environment variable configuration for Firebase
- `.env.example` configuration template
- Firebase and AsyncStorage dependencies

### Changed

- Replaced mock login navigation with real Firebase authentication
- Login access is now controlled by Firebase authentication state
- Dashboard access is restricted to authenticated users
- Signing out now clears the Firebase authentication session
- Expo Router determines whether the user sees the login or authenticated route
- Updated TypeScript configuration for Firebase React Native compatibility
- Consolidated the mobile foundation and authentication work into `main`

### Security

- User passwords are handled by Firebase Authentication and are not stored directly by CircuitIQ
- Firebase authentication state persists securely between application sessions
- `.env` is excluded from Git
- Firebase configuration is loaded through environment variables
- Protected routes prevent unauthenticated access to authenticated application screens

### Fixed

- Resolved Expo Go stale application state during authentication development
- Resolved React / React DOM dependency compatibility issues
- Resolved Firebase React Native persistence TypeScript compatibility
- Removed mock authentication behavior that allowed navigation without valid credentials


## [0.1.0] - Mobile Foundation

### Added

- React Native application using Expo
- TypeScript configuration
- Expo Router navigation
- Initial CircuitIQ application structure
- Login screen user interface
- Initial authenticated dashboard route
- CircuitIQ visual design foundation
- Dark industrial interface theme
- Reusable project structure for future features
- Git and GitHub version-control workflow
- Repository documentation structure
