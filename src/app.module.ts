import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/common/configs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './auth/password.service';
import { PaginationService } from './utils/pagination/pagination.service';
import { UuidService } from './utils/uuid/uuid.service';
import { UserModule } from './user/user.module';
import { FirebaseService } from './utils/firebase/firebase.service';
import { UserService } from './user/user.service';

import { DataService } from './utils/typesaurus/data.service';
import { CardModule } from './card/card.module';
import { EventModule } from './event/event.module';
import { CardTemplateModule } from './card-template/card-template.module';
import { OrderModule } from './order/order.module';
import { UserLinkModule } from './user-link/user-link.module';
import { PublicController } from './public/public.controller';
import { SocialPlatformProvider } from './common/provider/social-platform-provider';
import { ENSService } from './common/services/ens-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
    CardModule,
    EventModule,
    CardTemplateModule,
    OrderModule,
    UserLinkModule,
  ],
  controllers: [AppController, AuthController, PublicController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    PasswordService,
    UuidService,
    PaginationService,
    FirebaseService,
    UserService,
    DataService,
    SocialPlatformProvider,
    ENSService,
  ],
})
export class AppModule {}
