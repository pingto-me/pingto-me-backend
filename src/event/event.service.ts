import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  private collection = admin.firestore().collection('events');
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createEventDto: CreateEventDto) {
    const eventEntity = createEventDto as Event;
    eventEntity.createdAt = new Date();
    eventEntity.updatedAt = new Date();
    // create new event in firestore
    const eventDoc = this.collection.doc();
    eventEntity.id = eventDoc.id;
    await eventDoc.set({ ...eventEntity });
    return eventEntity;
  }

  findAllByUserId(userId: string) {
    return this.collection.where('ownerId', '==', userId).get();
  }

  findAll() {
    return this.collection.get();
  }

  async findOne(id: string) {
    const event = await this.collection.doc(id).get();
    // convert event to event entity
    return event.data() as Event;
  }

  async findOneByIdAndUserId(eventId: string, userId: string) {
    const events = await this.collection
      .where('ownerId', '==', userId)
      .where('id', '==', eventId)
      .get();

    // return first event found convert to type Event
    return events.docs[0].data() as Event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const eventEntity = updateEventDto as Event;
    eventEntity.updatedAt = new Date();
    // get event doc
    const eventDoc = this.collection.doc(id);
    await eventDoc.update({ ...eventEntity });
    return eventEntity;
  }

  async remove(id: string, ownerId: string) {
    // find event by id and owner id
    const eventQuery = await this.collection
      .where('ownerId', '==', ownerId)
      .where('id', '==', id)
      .get();
    // delete event
    return eventQuery.docs[0].ref.delete;
  }
}
