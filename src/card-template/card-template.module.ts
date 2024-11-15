import { Module } from '@nestjs/common';
import { CardTemplateService } from './card-template.service';
import { CardTemplateController } from './card-template.controller';

@Module({
  controllers: [CardTemplateController],
  providers: [CardTemplateService]
})
export class CardTemplateModule {}
