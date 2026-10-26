# CircuitIQ

CircuitIQ is an AI-powered electrical field intelligence platform designed for electricians, technicians, engineers, and field-service professionals.

## Project Goal

CircuitIQ is being developed to support electrical asset identification, equipment scanning, field inspections, technical information retrieval, and AI-assisted electrical workflows. CircuitIQ aims to make electrical fieldwork more efficient, manageable, and organized than current market products. 

## Current Milestone

**v0.1.0 - Mobile Foundation & Electrical Field Prototype**

**v0.1.0 - Trial Interface Iterations -(9/24/2026)**

**v0.2.0 - Login Authentication using Firebase and Signout Component (10/4/2026)**

**v0.3.0 - Currently in progress with dashboard UI and app design direction (10/6/2026)**

## Technology

- React Native 0.86
- Expo SDK 57
- React
- TypeScript
- Android
- Git
- GitHub
- Firebase
- Unsplash
- NestJS
- Prisma
- PostgreSQL

## Development Environment

Primary editor:

**Cursor**

Primary mobile development target:

**Pixel 7 Android Virtual Device**

Runtime:

**Android 17**

## Security

Secrets, API keys, credentials, and private environment variables must never be committed to this repository.

## Development Practice and Architecture

CircuitIQ aims to demonstrate practical software engineering concepts beyond basic mobile UI development.

### Mobile Application Development

- React Native application development
- Expo project configuration
- TypeScript-based development
- Android-focused development and testing
- Pixel 7 Android Virtual Device testing
- Component-based UI architecture
- Mobile navigation and screen organization
- Reusable UI components
- Centralized design system and theme management

### Software Engineering

- Modular project organization
- Separation of concerns
- Reusable TypeScript types and interfaces
- Domain-driven modeling of electrical assets
- Incremental feature development through sprints
- Versioned software releases
- Architecture documentation
- UML modeling
- Maintainable and extensible code structure

### Git & GitHub

- Local version control using Git
- Remote repository hosting using GitHub
- Incremental development history
- Repository hygiene

### Security & Configuration

- Environment-variable management
- Separation of secrets from source code
- `.gitignore` configuration
- `.env` for private local configuration
- `.env.example` for documented configuration requirements
- Prevention of API keys and credentials from entering version control

### Android Development Tooling

- Android Studio
- Android SDK
- Android Virtual Devices
- Android Debug Bridge (ADB)
- Emulator-based application testing
- Metro development server
- Expo Go development workflow

### Electrical Domain Modeling

- Electrical asset representation
- Equipment-type classification
- Equipment status modeling
- Structured electrical specifications
- Asset detail workflows
- Electrical equipment scan workflow design
- Human verification of AI-generated information

### Future Work -- AI-Oriented Architecture 

- Structured scan-result models
- Confidence values
- Human-in-the-loop verification
- Typed data contracts
- Separation between UI and future AI services
- A design that allows mock scan data to later be replaced by real multimodal AI responses

## Installation & Running

### Prerequisites

Before running CircuitIQ, make sure the following are installed:

- Node.js 24+
- npm
- Git
- Java JDK 17
- Android Studio
- Android SDK
- Android Debug Bridge (ADB)
- Pixel 7 Android Virtual Device

### 1. Clone the Repository

```bash

git clone [https://github.com/YOUR_USERNAME/CircuitIQ.git](https://github.com/YOUR_USERNAME/CircuitIQ.git)

cd CircuitIQ

```

Replace `YOUR_USERNAME` with the GitHub username that owns the CircuitIQ repository.

### 2. Install Dependencies

```bash

npm install

```

This installs the dependencies defined in `package.json` using the versions recorded in `package-lock.json`.

### 3. Configure Environment Variables

Create a local `.env` file using `.env.example` as a reference.

Example:

```env

EXPO_PUBLIC_API_URL=

AI_API_KEY=

DATABASE_URL=

JWT_SECRET=

```

Real credentials and secret values must never be committed to Git.

### 4. Start the Pixel 7 Emulator

Open Android Studio and launch the primary CircuitIQ development device:

- Pixel 7 AVD
- Android 17

Verify that ADB can detect the emulator:

```bash

adb devices

```

A successful connection should show the emulator with the status:

```text

device

```

### 5. Start the Expo Development Server

From the CircuitIQ project directory, run:

```bash

npm start

```

or:

```bash

npx expo start

```

This starts Expo and the Metro development server.

### 6. Run CircuitIQ on Android

With the Pixel 7 emulator running, press:

```text

a

```

inside the Expo terminal.

Alternatively, run:

```bash

npm run android

```

CircuitIQ should open on the Pixel 7 emulator through Expo Go.

### Git Development Workflow

Before beginning work:

```bash

git status

git pull

```

After completing a logical change:

```bash

git status

git add .

git status

git commit -m "feat: describe the change"

git push

```

### Troubleshooting

If ADB does not detect the emulator:

```bash

adb kill-server

adb start-server

adb devices

```

If project dependencies are missing:

```bash

npm install

```

If the Expo development server needs to be restarted:

```bash

npx expo start

```
## (Progress Notes)

CircuitIQ has helped me understand how a mobile application works beyond the user interface. Through this project, I have learned how the UI, application logic, authentication state, navigation, and project structure work together to create a functional mobile application.

One of the main challenges has been integrating Firebase Authentication with React Native and Expo while maintaining persistent user sessions and protected application routes. This helped me better understand authentication state management, dependency compatibility, environment configuration, and how different parts of a mobile application communicate with each other.

 Using Git and GitHub throughout development has helped me better understand branching, merging, commits, version tracking, and maintaining a clean development history.

As CircuitIQ continues to grow, the next major areas of development will include the dashboard, asset management, equipment scanning, inspections, work orders, and eventually a NestJS/PostgreSQL backend.
I will continue to update this section as this project grows and comes together. 

---

## YouTube

- [Marcin Hoffman — Computer Science YouTube Channel](https://www.youtube.com/@MarcinHoffman-CS)

---

## LinkedIn

Project updates and development progress are also posted on LinkedIn:

- [Marcin Hoffman — LinkedIn](https://www.linkedin.com/in/marcin-hoffman-935423282/)

---


## Project Status

CircuitIQ is currently under active development.

