import { Module } from '@nestjs/common';
import { UserLinkService } from './user-link.service';
import { UserLinkController } from './user-link.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Module({
  controllers: [UserLinkController],
  providers: [UserLinkService, FirebaseService],
})
export class UserLinkModule {}
