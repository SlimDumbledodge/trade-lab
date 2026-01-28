import "./instrument"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter"
import { ValidationPipe } from "@nestjs/common"
import { ResponseInterceptor } from "./common/interceptors/response.interceptors"
import helmet from "helmet"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const isDevelopment = process.env.NODE_ENV === "development"

    // Helmet - Sécurité des headers HTTP
    app.use(
        helmet({
            // Content Security Policy - Protection contre XSS
            contentSecurityPolicy: isDevelopment
                ? false // Désactivé en dev pour Swagger
                : {
                      directives: {
                          defaultSrc: ["'self'"],
                          styleSrc: ["'self'", "'unsafe-inline'"], // Swagger a besoin d'inline styles
                          scriptSrc: ["'self'"],
                          imgSrc: ["'self'", "data:", "https:"],
                      },
                  },
            // Force HTTPS en production
            hsts: isDevelopment
                ? false
                : {
                      maxAge: 31536000, // 1 an
                      includeSubDomains: true,
                      preload: true,
                  },
            // Empêche le site d'être mis dans une iframe
            frameguard: {
                action: "deny",
            },
        }),
    )

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
    const config = new DocumentBuilder().setTitle("Tradelab API").setVersion("0.1").build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document)
    await app.listen(process.env.PORT ?? 3001)
}
void bootstrap()
