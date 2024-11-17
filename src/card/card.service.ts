import { Injectable, Logger } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { Card } from './entities/card.entity';
import { QueryCardDto } from './dto/query-card.dto';
import * as moment from 'moment';
import { RandomService } from 'src/common/services/random.service';
import { UuidService } from 'src/utils/uuid/uuid.service';

const logger = new Logger('CardService');
@Injectable()
export class CardService {
  private collection = this.firebaseService.getFirestore().collection('cards');
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly randomService: RandomService,
    private readonly uuidService: UuidService,
  ) {}
  async create(createCardDto: CreateCardDto) {
    const cardEntity = createCardDto as Card;
    cardEntity.createdAt = new Date();
    cardEntity.updatedAt = new Date();

    // create new card in firestore
    const cardDoc = this.collection.doc();
    cardEntity.id = cardDoc.id;

    cardEntity.pinCode = this.randomService.generateRandomNumber(4);
    cardEntity.pingCount = 0;

    cardDoc.set({ ...cardEntity });
    return cardEntity;
  }

  async findAll(query: QueryCardDto) {
    const {
      timeRange,
      orderBy = 'createdAt',
      orderDirection = 'DESC',
      cardType,
      limit = 5,
    } = query;

    let queryBuilder: FirebaseFirestore.Query = this.collection;

    // Filter by cardType if provided
    if (cardType) {
      queryBuilder = queryBuilder.where('cardType', '==', cardType);
    }

    // Filter by timeRange
    if (timeRange) {
      const today = moment().startOf('day');
      let startDate: Date | null = null;

      switch (timeRange) {
        case 'this_week':
          startDate = today.startOf('isoWeek').toDate();
          break;
        case 'this_month':
          startDate = today.startOf('month').toDate();
          break;
        case 'this_year':
          startDate = today.startOf('year').toDate();
          break;
        default:
          break;
      }

      if (startDate) {
        queryBuilder = queryBuilder.where(
          'createdAt',
          '>=',
          moment(startDate.toISOString()),
        );
      }
    }

    // Apply ordering
    queryBuilder = queryBuilder.orderBy(
      orderBy,
      orderDirection.toLowerCase() as FirebaseFirestore.OrderByDirection,
    );

    // Apply limit if provided and valid
    if (limit) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }

    // Fetch data
    const cardsSnapshot = await queryBuilder.get();

    // Map and return results
    return cardsSnapshot.docs.map((card) => ({
      id: card.id,
      ...card.data(),
    }));
  }

  async findAllByUserId(userId: string) {
    const cards = await this.collection.where('userId', '==', userId).get();
    return cards.docs.map((card) => card.data() as Card);
  }

  async findOne(id: string) {
    logger.log(`findOne id: ${id}`);
    const cardSnapshot = await this.collection.doc(id).get();
    logger.log(`cardSnapshot: ${cardSnapshot}`);
    if (!cardSnapshot.exists) {
      throw new Error('Card not found');
    }
    return cardSnapshot.data() as Card;
  }

  async findOneByCode(code: string) {
    logger.log(`findOneByCode code: ${code}`);
    const cards = await this.collection.where('code', '==', code).get();
    if (cards.empty) {
      throw new Error('Card not found');
    }
    return cards.docs[0].data() as Card;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const cardEntity = updateCardDto as Card;
    cardEntity.updatedAt = new Date();
    // get event doc
    const cardDoc = this.collection.doc(id);
    await cardDoc.update({ ...cardEntity });
    return cardEntity;
  }

  async remove(id: string) {
    const cardDoc = this.collection.doc(id);
    const cardSnapshot = await cardDoc.get();
    await cardDoc.delete();
    return cardSnapshot.data() as Card;
  }

  async claimCardByCode(authUserId: string, code: string) {
    logger.log(`claimCardByCode code: ${code}`);
    const card = await this.findOneByCode(code);
    if (card.isRedeemed) {
      throw new Error('Card already redeemed');
    }
    /* if (card.pinCode !== pinCode) {
      throw new Error('Invalid pin code');
    }*/
    card.userId = authUserId;
    card.updatedAt = new Date();
    card.isRedeemed = true;
    logger.log(`claimCardBy userId: ${card.userId}`);

    const cardDoc = this.collection.doc(card.id);
    await cardDoc.update({ ...card });
    return card;
  }

  async increasePingCountByCode(id: string) {
    try {
      const cardDoc = this.collection.doc(id);
      const cardSnapshot = await cardDoc.get();
      if (!cardSnapshot.exists) {
        throw new Error('Card not found');
      }
      const card = cardSnapshot.data() as Card;
      card.pingCount += 1;
      await cardDoc.update({ pingCount: card.pingCount });
      return card;
    } catch (error) {
      // Handle error as needed, e.g., log it or rethrow
      console.error('Error increasing ping count:', error);
      throw error;
    }
  }

  async generateRandomCard(amount: number) {
    const cards: Card[] = [];
    for (let i = 0; i < amount; i++) {
      const card = new Card();
      card.cardName = `random no.${i + 1}`;
      card.code = await this.uuidService.makeCode(8);
      card.pinCode = this.randomService.generateRandomNumber(4);
      card.createdAt = new Date();
      card.updatedAt = new Date();
      card.isRedeemed = false;
      cards.push(card);
    }

    // Batch write to firestore
    const batch = this.firebaseService.getFirestore().batch();
    cards.forEach((card) => {
      const cardDoc = this.collection.doc();
      card.id = cardDoc.id;
      batch.set(cardDoc, { ...card });
    });
    await batch.commit();
    return cards;
  }

  async generateProtoType() {
    const codes = [
      '4XeW10dP',
      'XdGKQgJh',
      'AZMvuosf',
      'So9tOxAE',
      '9uSTXkk1',
      '7vrWhgdf',
      'uzsgb7PT',
      'SlqYaN4n',
      'n5iCR8WX',
      'gVzwqraG',
      'KOFsJXfe',
      'x5JJpnRz',
      'PWZcb2fA',
      'cYRBeN3n',
      'PE3nBhWA',
      'hDW9B5HU',
      'LvfE8TnQ',
      'A4tncpIj',
      'Qac1RuKr',
      'mp10Kk8l',
    ];
    const cards: Card[] = [];
    for (let i = 0; i < codes.length; i++) {
      const card = new Card();
      card.cardName = `random no.${i + 1}`;
      card.code = codes[i];
      card.pinCode = this.randomService.generateRandomNumber(4);
      card.createdAt = new Date();
      card.updatedAt = new Date();
      card.isRedeemed = false;
      cards.push(card);
    }

    // Batch write to firestore
    const batch = this.firebaseService.getFirestore().batch();
    cards.forEach((card) => {
      const cardDoc = this.collection.doc();
      card.id = cardDoc.id;
      batch.set(cardDoc, { ...card });
    });
    await batch.commit();
    return cards;
  }

  // update all card entity add eventId=1234
  async updateAllCardEventId() {
    const cards = await this.collection.get();
    cards.docs.forEach(async (card) => {
      const cardData = card.data() as Card;
      cardData.eventId = 'MMRrQlxjYUo4lG1iz3jD';
      const cardDoc = this.collection.doc(card.id);
      await cardDoc.update({ ...cardData });
    });
    return cards.docs.length;
  }
}
