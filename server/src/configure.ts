import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export function configure(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  const origins = (process.env.CORS_ORIGINS ?? '').split(',').map(origin => origin.trim()).filter(Boolean);
  if (origins.length) app.enableCors({ origin: origins });
  app.enableShutdownHooks();
}
