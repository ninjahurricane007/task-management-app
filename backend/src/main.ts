import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //telling nest js whenever it encounter a validation decorater, run the validation pipe
  app.useGlobalInterceptors(new TransformInterceptor()); //to remove user information while returning a task

  app.enableCors({
    origin: '*', //  allow Next.js frontend
    credentials: true, // if you're using cookies or auth headers
  });

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
