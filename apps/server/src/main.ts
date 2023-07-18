import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateBody } from './common/decorators/validate.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(ValidateBody);

  await app.listen(process.env.PORT || 3334);
}
bootstrap();
