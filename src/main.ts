import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cors from 'cors';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from 'src/common/configs/config.interface';

import * as admin from 'firebase-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const corsHandler = cors({ origin: true });

if (process.env.FIREBASEX_ENABLE == 'true') {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASEADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASEADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASEADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASEADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASEADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASEADMIN_AUTH_URI,
    token_uri: process.env.FIREBASEADMIN_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASEADMIN_AUTH_PROVIDER_X509_CERT_URL ||
      'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASEADMIN_CLIENT_X509_CERT_URL,
    universe_domain:
      process.env.FIREBASEADMIN_UNIVERSE_DOMAIN || 'googleapis.com',
  } as admin.ServiceAccount;
  // Init Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// Using express webserver
const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    {},
  );
  app.useBodyParser('json', { limit: '50mb' });
  // Validation
  /* app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );*/

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();

    const servers = swaggerConfig.servers || [];
    if (servers.length > 0) {
      options.servers = servers.map((url) => ({ url }));
    }
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  // Manual use cors
  app.use(corsHandler);

  // Nest
  const nestEnabled = process.env.NEST_ENABLE || 'false';
  Logger.log(`Nest enabled : ${nestEnabled}`);
  if (nestEnabled && nestEnabled === 'true') {
    app.listen(process.env.NEST_PORT || nestConfig.port || 3000);
  }

  return app.init();
};

createNestServer(server)
  .then((v) => Logger.log('Nest Ready ' + v))
  .catch((err) => Logger.error('Nest broken', err));
// locate all functions closest to users
// export const api: functions.HttpsFunction = functions
//   .region('asia-southeast1')
//   .https.onRequest(server);
