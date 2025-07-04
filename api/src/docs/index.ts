import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';

export const options = new DocumentBuilder()
  .setTitle('Absolute Tech API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag(SWAGGER_TAG.Auth)
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'jwt',
      name: 'jwt',
      description: 'Enter JWT token',
      in: 'header',
    },
    NAME.JWT,
  )
  .build();
export const customOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Absolute Tech API',
};
