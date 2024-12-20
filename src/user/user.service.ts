/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { db } from 'src/utils/typesaurus/db';
import { Role } from 'src/models/role.enum';
import { ProviderDataEntity } from './entities/provider-data.entity';
import { Provider } from 'src/models/provider.enum';
import { UuidService } from 'src/utils/uuid/uuid.service';

import { UserListDto } from './dto/user-list.dto';
import { DataService } from 'src/utils/typesaurus/data.service';
import { SaveAccountRawDataDto } from './dto/save-account-raw-data.dto';
import { WalletType } from 'src/utils/interface/wallet-type';
import { UpdateUserProfile } from './dto/update-profile.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { BlockscoutService } from 'src/common/services/blockscout.service';

const _ = require('lodash');
const axios = require('axios');
@Injectable()
export class UserService {
  private userCollection = this.firebaseService
    .getFirestore()
    .collection('users');

  private userLinkCollection = this.firebaseService
    .getFirestore()
    .collection('user-linkes');
  constructor(
    private uuidService: UuidService,
    private dataService: DataService,
    private firebaseService: FirebaseService,
    private blockscoutService: BlockscoutService,
  ) {}

  async getUserProfileCard(userId: string) {
    const userSnapshot = await this.userCollection.doc(userId).get();
    const UserEntity = userSnapshot.data() as UserEntity;
    // find user-link by userId and sort by order
    const userLinkSnapshot = await this.userLinkCollection
      .where('userId', '==', userId)
      .orderBy('order')
      .get();
    const userLink = userLinkSnapshot.docs.map((doc) => doc.data());
    return { ...UserEntity, userLink };
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const findUser = await db.users.get(db.users.id(userId));
    if (findUser) {
      const user = findUser.data;
      const providerDatas = await db.providerDatas.query(($) =>
        $.field('userId').eq(userId),
      );
      Object.assign(user, { providerData: providerDatas[0].data });

      return user;
    } else {
      throw new NotFoundException(`User not found`);
    }
  }

  async getUserBasicInfoById(userId: string): Promise<UserEntity> {
    const findUser = await db.users.get(db.users.id(userId));
    if (findUser) {
      const user = findUser.data;
      // remove non basic info
      delete user.role;
      delete user.point;
      delete user.provider;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    } else {
      throw new NotFoundException(`User not found`);
    }
  }

  async saveAccountRawDataByUserId(
    userId: string,
    payload: SaveAccountRawDataDto,
  ) {
    const providerDatas = await db.providerDatas.query(($) =>
      $.field('userId').eq(userId),
    );
    if (providerDatas.length == 0) {
      throw new NotFoundException(`User not found`);
    }
    await db.providerDatas.update(
      db.providerDatas.id(providerDatas[0].data.id),
      { accountRawData: payload.rawData },
    );
    const providerDataRef = await db.providerDatas.get(
      db.providerDatas.id(providerDatas[0].data.id),
    );
    return providerDataRef.data;
  }

  async getUserByPublicAddress(
    publicAddress: string,
    walletType: WalletType,
  ): Promise<UserEntity> {
    let user: UserEntity;
    const providerDatas = await db.providerDatas.query(($) =>
      $.field('walletAddress').eq(publicAddress),
    );
    if (providerDatas.length == 0) {
      const userId = `${await this.uuidService.generateUuid()}`;
      let referralCode;
      let isRef = false;
      while (!isRef) {
        referralCode = `${await this.uuidService.makeCode(8)}`;
        const user = await this.findReferralCode(referralCode);
        if (!user) {
          isRef = true;
        }
      }
      const data: UserEntity = {
        id: userId,
        role: Role.USER,
        provider: Provider.WALLET,
        walletType: walletType,
        referralCode,
        point: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const providerDataId = `${await this.uuidService.generateUuid()}`;
      const pData: ProviderDataEntity = {
        id: providerDataId,
        userId,
        provider: Provider.WALLET,
        walletType,
        isVerified: true,
        walletAddress: publicAddress,
      };
      await db.users.set(db.users.id(userId), data);
      await db.providerDatas.set(db.providerDatas.id(providerDataId), pData);
      const providerData = (
        await db.providerDatas.get(db.providerDatas.id(providerDataId))
      ).data;
      user = (await db.users.get(db.users.id(userId))).data;
      Object.assign(user, { providerData });
    } else {
      user = (await db.users.get(db.users.id(providerDatas[0].data.userId)))
        .data;
      Object.assign(user, { providerData: providerDatas[0].data });
    }

    return user;
  }

  async randomUserNonce(userId: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 10000);
    const providerDatas = await db.providerDatas.query(($) =>
      $.field('userId').eq(userId),
    );
    if (providerDatas.length == 0) {
      throw new NotFoundException(`User not found`);
    }
    await db.providerDatas.update(
      db.providerDatas.id(providerDatas[0].data.id),
      { nonce: `${nonce}` },
    );
    return `${nonce}`;
  }

  async findReferralCode(referralCode: string): Promise<UserEntity> {
    const users = await db.users.query(($) =>
      $.field('referralCode').eq(referralCode),
    );
    if (users.length == 0) {
      return null;
    }
    return users[0].data;
  }

  async list(query: UserListDto) {
    const { email, isPagination = false } = query;
    const filterBy = [];
    if (email) {
      filterBy.push({ type: 'eq', field: 'email', value: email });
    }
    Object.assign(query, { filterBy });
    const result = await this.dataService.list('users', query, isPagination);
    return result;
  }

  async updateProfile(id: any, body: UpdateUserProfile) {
    const userSnapshot = await this.userCollection.doc(id).get();
    if (!userSnapshot.exists) {
      throw new NotFoundException(`User not found`);
    }
    const userEntity = userSnapshot.data() as UserEntity;
    if (userEntity.id !== id) {
      throw new NotFoundException(`User not found or unauthorized`);
    }
    await this.userCollection.doc(id).update({ ...body });
    const updatedUserSnapshot = await this.userCollection.doc(id).get();
    return updatedUserSnapshot.data();
  }

  async getMyNftList(userId: string, chain: string) {
    const user = await this.getUserById(userId);
    const walletAddress = user.providerData.walletAddress;
    Logger.debug('walletAddress', walletAddress);
    // const allowedChain = await _.find(chainWhitelist, { chain });
    // Logger.debug('allowedChain', allowedChain);
    // if (!allowedChain) {
    //   throw new NotFoundException(`Chain not found`);
    // }
    // const compiled = _.template(allowedChain.apiUrl);
    // const apiUrl = compiled({ address: walletAddress });
    // Logger.debug('apiUrl', apiUrl);
    // let result = [];
    // try {
    //   const response = await axios.get(apiUrl);
    //   result = response.data;
    // } catch (error) {
    //   Logger.error('error', error);
    //   throw new NotFoundException(`NFT not found`);
    // }
    const result = await this.blockscoutService.findNFTsByOwner(
      chain,
      walletAddress,
    );
    return result;
  }

  async getUserProfileByRefCode(refCode: string) {
    const users = await db.users.query(($) =>
      $.field('referralCode').eq(refCode),
    );
    if (users.length === 0) {
      throw new NotFoundException(`User not found for this referral code`);
    }
    const userEntity = users[0].data as UserEntity;

    // // find user-link by userId and sort by order
    const userLinkSnapshot = await this.userLinkCollection
      .where('userId', '==', userEntity?.id)
      .orderBy('createdAt')
      .get();
    const userLink = userLinkSnapshot.docs.map((doc) => doc.data());
    return { ...userEntity, userLink };
  }
}
