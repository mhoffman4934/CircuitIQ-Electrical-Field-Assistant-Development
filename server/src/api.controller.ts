import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { CurrentUser, FirebaseAuthGuard } from './auth';
import { AssetsService } from './assets.service';
import { DashboardService } from './dashboard.service';
import { WorkspaceService } from './workspace.service';
import { CreateAssetDto, CreateWorkspaceDto, PageQuery } from './dto';

@Controller()
@UseGuards(FirebaseAuthGuard)
export class ApiController {
  constructor(
    private readonly assets: AssetsService,
    private readonly dashboard: DashboardService,
    private readonly workspace: WorkspaceService,
  ) {}

  @Get('me') me(@CurrentUser() user: DecodedIdToken) {
    return { uid: user.uid, email: user.email ?? null, name: user.name ?? null };
  }
  @Get('dashboard') summary(@CurrentUser() user: DecodedIdToken) { return this.dashboard.summary(user.uid); }
  @Post('workspace') createWorkspace(@CurrentUser() user: DecodedIdToken, @Body() input: CreateWorkspaceDto) {
    return this.workspace.create(user.uid, input);
  }
  @Get('assets') list(@CurrentUser() user: DecodedIdToken, @Query() query: PageQuery) { return this.assets.list(user.uid, query); }
  @Post('assets') createAsset(@CurrentUser() user: DecodedIdToken, @Body() input: CreateAssetDto) {
    return this.assets.create(user.uid, input);
  }
  @Get('assets/:id') asset(@CurrentUser() user: DecodedIdToken, @Param('id', ParseUUIDPipe) id: string) {
    return this.assets.get(user.uid, id);
  }
}

@Controller('health')
export class HealthController {
  @Get() health() { return { status: 'ok' }; }
}
