import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  private collection = this.firebaseService.getFirestore().collection('cards');
  constructor(private readonly firebaseService: FirebaseService) {}
  async create(createCardDto: CreateCardDto) {
    const cardEntity = createCardDto as Card;
    cardEntity.createdAt = new Date();
    cardEntity.updatedAt = new Date();

    // create new card in firestore
    const cardDoc = this.collection.doc();
    cardEntity.id = cardDoc.id;
    cardDoc.set({ ...cardEntity });
    return cardEntity;
  }

  findAll() {
    return `This action returns all card`;
  }

  async findAllByUserId(userId: string) {
    const cards = await this.collection.where('userId', '==', userId).get();
    return cards.docs.map((card) => card.data() as Card);
  }

  async findOne(id: string) {
    const cardSnapshot = await this.collection.doc(id).get();
    if (!cardSnapshot.exists) {
      throw new Error('Card not found');
    }
    return cardSnapshot.data() as Card;
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
}
