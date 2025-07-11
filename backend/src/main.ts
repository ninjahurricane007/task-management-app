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
    origin: 'http://localhost:3001', //  allow Next.js frontend
    credentials: true, // if you're using cookies or auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log('Application is running on port 3000');
}
bootstrap();
