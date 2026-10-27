import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
 
 
  getHello(): string {
    return 'Hello World!';
  }  
  
  getHealth(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'CircuitIQ API',
    };
   }


    async getReadiness(): Promise<{
      status: string;
      database: string;
    }> {
      try {
        await this.prisma.organization.count();

        return {
          status: 'ok',
          database: 'connected',
        };
      } catch {
        throw new ServiceUnavailableException({
          status: 'error',
          database: 'disconnected',
        });
      }
    }
  }

