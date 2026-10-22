import { Module } from '@nestjs/common';
import { ApiController, HealthController } from './api.controller';
import { FirebaseAuthGuard, FirebaseTokenVerifier } from './auth';
import { PrismaService } from './prisma.service';
import { WorkspaceService } from './workspace.service';
import { AssetsService } from './assets.service';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [ApiController, HealthController],
  providers: [PrismaService, FirebaseAuthGuard, FirebaseTokenVerifier, WorkspaceService, AssetsService, DashboardService],
})
export class AppModule {}
