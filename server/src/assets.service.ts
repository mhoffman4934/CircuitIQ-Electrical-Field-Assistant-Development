import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WorkspaceService } from './workspace.service';
import { CreateAssetDto, PageQuery } from './dto';
import { Prisma } from './generated/prisma/client';

@Injectable()
export class AssetsService {
  constructor(private readonly db: PrismaService, private readonly workspace: WorkspaceService) {}

  async list(uid: string, query: PageQuery) {
    const organizationId = await this.workspace.organizationId(uid);
    const where: Prisma.AssetWhereInput = {
      organizationId,
      ...(query.search ? { OR: [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { assetTag: { contains: query.search, mode: 'insensitive' as const } },
      ] } : {}),
    };
    const [items, total] = await this.db.$transaction([
      this.db.asset.findMany({ where, include: { site: true }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (query.page - 1) * 25, take: 25 }),
      this.db.asset.count({ where }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    return { items, total, page: query.page, pageSize: 25 };
  }

  async get(uid: string, id: string) {
    const organizationId = await this.workspace.organizationId(uid);
    const asset = await this.db.asset.findFirst({ where: { id, organizationId }, include: { site: true } });
    if (!asset) throw new NotFoundException('Asset not found.');
    return asset;
  }

  async create(uid: string, input: CreateAssetDto) {
    const organizationId = await this.workspace.organizationId(uid);
    const site = await this.db.site.findFirst({ where: { id: input.siteId, organizationId } });
    if (!site) throw new NotFoundException('Site not found.');
    try {
      return await this.db.$transaction(async tx => {
        const asset = await tx.asset.create({ data: { ...input, organizationId }, include: { site: true } });
        await tx.activity.create({ data: { organizationId, assetId: asset.id, actorId: uid, action: 'ASSET_CREATED' } });
        return asset;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('That asset tag is already used in your organization.');
      }
      throw error;
    }
  }
}
