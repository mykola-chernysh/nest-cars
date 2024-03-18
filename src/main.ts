import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EAccount } from './common/enums/account.enum';
import { ERole } from './common/enums/role.enum';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import { SwaggerHelper } from './common/helpers/swagger.helper';
import { AppConfig, Config } from './configs/config.type';
import { AppModule } from './modules/app.module';
import { AuthService } from './modules/auth/services/auth.service';
import { BankService } from './modules/currency/service/bank.service';
import { BaseUserRequestDto } from './modules/user/models/dto/request/base-user.request.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cars API')
    .setDescription('Cars API similar to AutoRia')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelExpandDepth: '3',
      persistAuthorization: true,
    },
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService<Config>);
  const appConfig = configService.get<AppConfig>('app');

  const authService = app.get(AuthService);
  const superAdmin: BaseUserRequestDto = {
    firstName: 'Tom',
    lastName: 'Marvolo Riddle',
    email: 'admin@example.com',
    password: 'qwerty123',
    role: ERole.ADMIN,
    account: EAccount.PREMIUM,
  };

  const isSuperAdminExist = await authService.isSuperAdminExist(superAdmin.email);
  if (!isSuperAdminExist) {
    await authService.createSuperAdmin(superAdmin);
    Logger.log('Admin user created successfully.');
  }

  await app.listen(appConfig.port, () => {
    const url = `http://${appConfig.host}:${appConfig.port}`;
    Logger.log(`Server running ${url}`);
    Logger.log(`Swagger running ${url}/api`);
  });

  const appCreateBankRequest = app.get(BankService);
  await appCreateBankRequest.getAndSave();
}
void bootstrap();
