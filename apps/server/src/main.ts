import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { AppModule } from './app.module';
import { ValidateBody } from './common/decorators/validate.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 禁用express的etag
  (app.getHttpAdapter() as unknown as Express).set('etag', false);

  app.enableCors();

  app.useGlobalPipes(ValidateBody);

  await app.listen(process.env.PORT || 3334);
}
bootstrap();
