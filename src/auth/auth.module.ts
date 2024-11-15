import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { DataService } from 'src/utils/typesaurus/data.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    FirebaseService,
    JwtStrategy,
    PasswordService,
    UuidService,

    UserService,
    DataService,

    PaginationService,
  ],
})
export class AuthModule {}
