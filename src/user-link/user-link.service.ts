import { Injectable } from '@nestjs/common';
import { CreateUserLinkDto } from './dto/create-user-link.dto';
import { UpdateUserLinkDto } from './dto/update-user-link.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UserLink } from './entities/user-link.entity';

@Injectable()
export class UserLinkService {
  private collection = this.firebaseService
    .getFirestore()
    .collection('user-linkes');
  constructor(private readonly firebaseService: FirebaseService) {}
  async create(createUserLinkDto: CreateUserLinkDto) {
    const userLink = createUserLinkDto as UserLink;
    userLink.createdAt = new Date();
    userLink.updatedAt = new Date();
    // create new event in firestore
    const userLinkDoc = this.collection.doc();
    userLink.id = userLinkDoc.id;
    await userLinkDoc.set({ ...userLink });
    return userLink;
  }

  async findAll() {
    return this.collection.get();
  }

  async findAllByUserId(userId: string) {
    return this.collection.where('userId', '==', userId).get();
  }

  async findOne(id: string, userId: string = null) {
    const userLinkRef = this.collection.doc(id);
    const userLinkSnapshot = await userLinkRef.get();
    if (!userLinkSnapshot.exists) {
      throw new Error('UserLink not found');
    }
    const userLink = userLinkSnapshot.data() as UserLink;
    if (userId && userLink.userId !== userId) {
      throw new Error('UserLink not found');
    }
    return userLink;
  }

  async update(id: string, updateUserLinkDto: UpdateUserLinkDto) {
    const userLinkRef = this.collection.doc(id);
    const userLinkSnapshot = await userLinkRef.get();
    if (!userLinkSnapshot.exists) {
      throw new Error('UserLink not found');
    }
    const userLink = updateUserLinkDto as UserLink;
    // check if userLink owner matches ownerId
    if (userLink.userId !== updateUserLinkDto.userId) {
      throw new Error('UserLink not found or unauthorized');
    }
    userLink.updatedAt = new Date();
    await userLinkRef.update({ ...updateUserLinkDto });
    return userLink;
  }

  async remove(id: string, userId: string) {
    const userLinkRef = this.collection.doc(id);
    // check userLink owner matches userId
    const userLinkSnapshot = await userLinkRef.get();
    if (!userLinkSnapshot.exists) {
      throw new Error('UserLink not found');
    }
    const userLink = userLinkSnapshot.data() as UserLink;
    if (userLink.userId !== userId) {
      throw new Error('UserLink not found');
    }
    // delete userLink
    await userLinkRef.delete();
    return userLink;
  }
}
