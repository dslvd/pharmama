import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:3000", "https://se3pharmama.vercel.app"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log("About to listen...");
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
}

bootstrap();
