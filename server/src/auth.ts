import {
  CanActivate, createParamDecorator, ExecutionContext, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import type { Request } from 'express';

type AuthRequest = Request & { identity?: DecodedIdToken };

@Injectable()
export class FirebaseTokenVerifier {
  private readonly auth;

  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required');
    if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      throw new Error('The Firebase Auth emulator cannot be enabled in production');
    }
    const app = getApps()[0] ?? initializeApp({ projectId, credential: applicationDefault() });
    this.auth = getAuth(app);
  }

  verify(token: string) {
    // Check revocation and disabled accounts, in addition to signature/expiry.
    return this.auth.verifyIdToken(token, true);
  }
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly verifier: FirebaseTokenVerifier) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const match = /^Bearer (\S+)$/i.exec(request.headers.authorization ?? '');
    if (!match) throw new UnauthorizedException('Sign in to continue.');
    try {
      request.identity = await this.verifier.verify(match[1]);
    } catch {
      throw new UnauthorizedException('Your session could not be verified. Sign in again.');
    }
    return true;
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const identity = context.switchToHttp().getRequest<AuthRequest>().identity;
  if (!identity) throw new UnauthorizedException();
  return identity;
});
