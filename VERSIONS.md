# CircuitIQ Version Registry

Last audited: September 22, 2026

## Development Environment

| Component | Version |

|---|---|

| Node.js | 24.21.0 |

| TypeScript (backend) | 6.0.3 |

| NestJS CLI used for scaffolding | 12.0.10 |

| @nestjs/platform-express | 12.2.0 |

| Prisma CLI | 7.10.1 |

| Prisma Client | 7.10.1 |

| PostgreSQL Docker image | postgres:17 |

| Vitest | 4.1.12 |

| Multer override | 2.5.0 |

## Mobile

| Component | Version |

|---|---|

| CircuitIQ | 0.1.0 |

| Expo SDK | ~57.0.24 |

| Expo Status Bar | ~57.0.1 |

| React | 19.2.3 |

| React Native | 0.86.3 |

| TypeScript | ~6.0.3 |

| React Types | ~19.2.2 |

## Development Tools

| Component | Configuration |

|---|---|

| Primary Editor | Cursor |

| Android IDE | Android Studio |

| Primary Test Device | Pixel 7 AVD |

## Notes

CircuitIQ uses a Pixel 7 Android Virtual Device running Android 17 as its primary development and testing platform.

Versions recorded here establish the baseline for future CircuitIQ version audits.

Prisma remains on version 7 for this implementation. 

Prisma 8 release-candidate adoption is deferred.

Multer is overridden to 2.5.0.

The unused @nestjs/mau dependency was removed.

  
## Backend Configuration

| Setting | Value |
|---|---|
| Backend framework | NestJS |
| Backend language | TypeScript |
| Module format | ESM |
| Database | PostgreSQL |
| ORM | Prisma |
| Local API port | 3000 |
| Local database address | 127.0.0.1:5432 |
| Development database name | circuitiq |
| Prisma configuration | server/prisma7.config.ts |
| Prisma schema | server/prisma/schema.prisma |
| Generated client location | server/src/generated/prisma |
| Environment template | server/.env.example |


