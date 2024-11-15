import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Module({
  controllers: [EventController],
  providers: [EventService, FirebaseService],
})
export class EventModule {}
