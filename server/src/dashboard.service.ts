import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WorkspaceService } from './workspace.service';
import { Prisma } from './generated/prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly db: PrismaService, private readonly workspace: WorkspaceService) {}

  async summary(uid: string) {
    const membership = await this.workspace.membership(uid);
    if (!membership) return { workspace: null, assetCount: 0, recentActivity: [] };
    const organizationId = membership.organizationId;
    const [assetCount, recentActivity] = await this.db.$transaction([
      this.db.asset.count({ where: { organizationId } }),
      this.db.activity.findMany({
        where: { organizationId }, include: { asset: { select: { id: true, assetTag: true, name: true } } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 10,
      }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    return { workspace: membership.organization, assetCount, recentActivity };
  }
}
