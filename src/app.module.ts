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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, AuthController],
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
  ],
})
export class AppModule {}
