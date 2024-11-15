import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Module({
  controllers: [CardController],
  providers: [CardService, FirebaseService],
})
export class CardModule {}
