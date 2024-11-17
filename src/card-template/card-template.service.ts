import { Injectable } from '@nestjs/common';
import { CreateCardTemplateDto } from './dto/create-card-template.dto';
import { UpdateCardTemplateDto } from './dto/update-card-template.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { CardTemplate } from './entities/card-template.entity';
import { CardTemplateType } from 'src/models/card-template-type.enum';
import { Card } from 'src/card/entities/card.entity';

@Injectable()
export class CardTemplateService {
  private collection = this.firebaseService
    .getFirestore()
    .collection('card-templates');
  constructor(private readonly firebaseService: FirebaseService) {}
  async create(createCardTemplateDto: CreateCardTemplateDto) {
    const cardTemplate = createCardTemplateDto as CardTemplate;
    cardTemplate.createdAt = new Date();
    cardTemplate.updatedAt = new Date();
    // create new event in firestore
    const cardTemplateDoc = this.collection.doc();
    cardTemplate.id = cardTemplateDoc.id;
    await cardTemplateDoc.set({ ...cardTemplate });
    return cardTemplate;
  }

  async findAll(templateType: CardTemplateType = CardTemplateType.SYSTEM) {
    return this.collection.where('templateType', '==', templateType).get();
  }

  async findOne(id: string) {
    const cardTemplate = await this.collection.doc(id).get();
    // convert to card template entity
    return cardTemplate.data() as CardTemplate;
  }

  async update(id: string, updateCardTemplateDto: UpdateCardTemplateDto) {
    const entityData = updateCardTemplateDto as CardTemplate;
    entityData.updatedAt = new Date();
    // get event doc
    const entityDoc = this.collection.doc(id);
    await entityDoc.update({ ...entityData });
    return entityData;
  }

  async remove(id: string, ownerId: string) {
    const entityRef = this.collection.doc(id);
    // check entityDoc owner matches ownerId
    const entitySnapshot = await entityRef.get();
    if (!entitySnapshot.exists) {
      throw new Error('Entity not found');
    }
    const entityData = entitySnapshot.data() as CardTemplate;
    if (entityData.ownerId !== ownerId) {
      throw new Error('Entity not found');
    }
    // check if cardType is SYSTEM
    if (entityData.templateType === CardTemplateType.SYSTEM) {
      throw new Error('Cannot delete system card template');
    }

    // check if card template is readonly return error
    if (entityData.readonly) {
      throw new Error('Cannot delete readonly card template');
    }
    // delete entity
    await entityRef.delete();
    return entityData;
  }
}
