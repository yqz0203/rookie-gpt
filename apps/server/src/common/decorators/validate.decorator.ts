import { ValidationPipe } from '@nestjs/common';

export const ValidateBody = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
