import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { CardService } from 'src/card/card.service';
import { EventService } from 'src/event/event.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { RandomService } from 'src/common/services/random.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    FirebaseService,
    CardService,
    EventService,
    UuidService,
    RandomService,
  ],
})
export class OrderModule {}
