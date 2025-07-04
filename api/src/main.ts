import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, options } from './docs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors: Array<{ field: string; messages: string[] }> = [];

        for (const err of validationErrors) {
          if (err.constraints) {
            errors.push({
              field: err.property,
              messages: Object.values(err.constraints),
            });
          }
          if (err.children && err.children.length) {
            for (const child of err.children) {
              if (child.constraints) {
                errors.push({
                  field: child.property,
                  messages: Object.values(child.constraints),
                });
              }
            }
          }
        }

        return new UnprocessableEntityException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Validation error',
          errors,
        });
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: '*',
  });
  //ADD: swagger
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
