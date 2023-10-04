import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  });

  await app.listen(8080);
}

bootstrap();

