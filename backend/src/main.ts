import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter"
import { ValidationPipe } from "@nestjs/common"
import { ResponseInterceptor } from "./common/interceptors/response.interceptors"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Parse CORS origins - supporte plusieurs origines séparées par virgule
    const corsOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
        : ["http://localhost:3000"]

    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    })
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    )
    app.useGlobalInterceptors(new ResponseInterceptor())
    const config = new DocumentBuilder().setTitle("TradeLab API").setVersion("0.1").build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document)
    await app.listen(process.env.PORT ?? 3001)
}
void bootstrap()
