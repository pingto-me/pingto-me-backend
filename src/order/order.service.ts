import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { OrderEntity } from './entities/order.entity';
import { CardService } from 'src/card/card.service';
import { EventService } from 'src/event/event.service';

const logger = new Logger('OrderService');
@Injectable()
export class OrderService {
  private collection = this.firebaseService.getFirestore().collection('orders');
  constructor(
    private readonly firebaseService: FirebaseService,
    private cardService: CardService,
    private eventService: EventService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    // 1. get card entity
    const cardEntity = await this.cardService.findOne(createOrderDto.cardId);
    logger.log(`1. card entity ${cardEntity}`);
    // 2. get event entity
    const eventEntity = await this.eventService.findOne(cardEntity.eventId);
    logger.log(`2. event entity ${eventEntity}`);
    // TODO: get convert usd to local currency
    const orderDoc = this.collection.doc();
    const orderData = {
      id: orderDoc.id,
      ...createOrderDto,
      eventId: eventEntity.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orderDoc.set(orderData);
    return orderData;
  }

  async checkOrderPayment(orderId: string) {
    const order = await this.findOne(orderId);
  }

  async findAll(userId: string = null) {
    if (userId) {
      return this.collection.where('userId', '==', userId).get();
    }
    return this.collection.get();
  }

  async findOne(id: string, userId: string = null) {
    const orderRef = this.collection.doc(id);
    const orderSnapshot = await orderRef.get();
    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }
    const order = orderSnapshot.data() as OrderEntity;
    if (userId && order.userId !== userId) {
      throw new Error('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderRef = this.collection.doc(id);
    const orderSnapshot = await orderRef.get();
    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }
    const order = updateOrderDto as OrderEntity;
    // check if order owner matches ownerId
    if (order.userId !== updateOrderDto.userId) {
      throw new Error('Order not found or unauthorized');
    }
    order.updatedAt = new Date();
    await orderRef.update({ ...updateOrderDto });
    return order;
  }

  async remove(id: string, userId: string = null) {
    const orderRef = this.collection.doc(id);
    const orderSnapshot = await orderRef.get();
    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }
    const order = orderSnapshot.data() as OrderEntity;
    if (userId && order.userId !== userId) {
      throw new Error('Order not found');
    }
    await orderRef.delete();
    return order;
  }
}
