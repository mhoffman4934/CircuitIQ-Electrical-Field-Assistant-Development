import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateWorkspaceDto } from './dto';
import { Prisma } from './generated/prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly db: PrismaService) {}

  async membership(uid: string) {
    return this.db.membership.findUnique({
      where: { userId: uid },
      include: { organization: { include: { sites: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } } } },
    });
  }

  async organizationId(uid: string) {
    const membership = await this.db.membership.findUnique({ where: { userId: uid } });
    if (!membership) throw new ForbiddenException('Create your workspace first.');
    return membership.organizationId;
  }

  async create(uid: string, input: CreateWorkspaceDto) {
    try {
      return await this.db.$transaction(async tx => {
        await tx.user.upsert({ where: { firebaseUid: uid }, create: { firebaseUid: uid }, update: {} });
        if (await tx.membership.findUnique({ where: { userId: uid } })) {
          throw new ConflictException('This account already has a workspace.');
        }
        return tx.organization.create({
          data: {
            name: input.name,
            members: { create: { userId: uid } },
            sites: { create: { name: input.siteName } },
          },
          include: { sites: true },
        });
      });
    } catch (error) {
      // Unique user membership also protects concurrent first-run requests.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('This account already has a workspace.');
      }
      throw error;
    }
  }
}
