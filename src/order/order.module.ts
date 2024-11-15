import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { CardService } from 'src/card/card.service';
import { EventService } from 'src/event/event.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, FirebaseService, CardService, EventService],
})
export class OrderModule {}
