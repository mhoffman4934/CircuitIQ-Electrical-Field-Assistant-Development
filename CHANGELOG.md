# Changelog

All notable changes to CircuitIQ will be documented in this file.

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
