import { Module } from '@nestjs/common';
import { UserLinkService } from './user-link.service';
import { UserLinkController } from './user-link.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { SocialPlatformProvider } from 'src/common/provider/social-platform-provider';

@Module({
  controllers: [UserLinkController],
  providers: [UserLinkService, FirebaseService, SocialPlatformProvider],
})
export class UserLinkModule {}
