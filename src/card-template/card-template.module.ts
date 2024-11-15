import { Module } from '@nestjs/common';
import { CardTemplateService } from './card-template.service';
import { CardTemplateController } from './card-template.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Module({
  controllers: [CardTemplateController],
  providers: [CardTemplateService, FirebaseService],
})
export class CardTemplateModule {}
