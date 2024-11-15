/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { SecurityConfig } from 'src/common/configs/config.interface';

import { UserEntity } from 'src/user/entities/user.entity';

import { db } from 'src/utils/typesaurus/db';

import { Token } from 'src/models/token.interface';

import { AuthRespondInterface } from './dto/auth-respond.interface';

import { PasswordService } from './password.service';

import { ValidatePublicAddressInput } from './dto/validate-public-address.input';
import { ValidatePublicAddressRespond } from './dto/validate-public-address.respond';
import { SigninPublicAddressInput } from './dto/signin-public-address.input';
import { UserService } from 'src/user/user.service';

import * as ethUtil from 'ethereumjs-util';
import { Address, Cell, contractAddress, loadStateInit } from '@ton/ton';
import { randomBytes } from 'tweetnacl';
import { jwtVerify, SignJWT } from 'jose';
import { WalletType } from 'src/utils/interface/wallet-type';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private uuidService: UuidService,
    private readonly passwordService: PasswordService,
    private userService: UserService,
  ) {}

  async validateWithPublicAddress(
    payload: ValidatePublicAddressInput,
  ): Promise<ValidatePublicAddressRespond> {
    const { publicAddress, walletType } = payload;
    const user = await this.userService.getUserByPublicAddress(
      publicAddress,
      walletType,
    );
    const nonce = await this.userService.randomUserNonce(user.id);
    user.providerData.nonce = nonce;
    const msg = `Onetime singin with OTP: ${nonce}`;
    return { user, nonce, msg };
  }

  async signinWithPublicAddress(
    payload: SigninPublicAddressInput,
  ): Promise<AuthRespondInterface> {
    const { publicAddress, signature, walletType } = payload;
    const user: UserEntity = await this.userService.getUserByPublicAddress(
      publicAddress,
      walletType,
    );
    // TODO: implement when bitkubnext support sign message function
    if (WalletType.BITKUBNEXT == payload.walletType) {
      const tokens = await this.generateTokens({ userId: user.id });
      return { user, tokens };
    }
    const nonce = user.providerData.nonce;
    if (user && nonce) {
      const msg = `Onetime singin with OTP: ${nonce}`;
      const msgBuffer = ethUtil.toBuffer(
        ethUtil.bufferToHex(Buffer.from(msg, 'utf8')),
      );
      const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      const signatureBuffer: any = ethUtil.toBuffer(signature);
      const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s,
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const address = ethUtil.bufferToHex(addressBuffer);
      if (address.toLowerCase() === publicAddress.toLowerCase()) {
        const tokens = await this.generateTokens({ userId: user.id });
        return { user, tokens };
      } else {
        throw new UnauthorizedException(`Incorrect public address and nonce`);
      }
    } else {
      throw new NotFoundException(`User not found`);
    }
  }

  // Testing Api
  async signinWithBypassPublicAddress(
    payload: SigninPublicAddressInput,
  ): Promise<AuthRespondInterface> {
    const { publicAddress } = payload;
    const user: UserEntity = await this.userService.getUserByPublicAddress(
      publicAddress,
      WalletType.METAMASK,
    );
    const tokens = await this.generateTokens({ userId: user.id });
    return { user, tokens };
  }

  async validateUser(userId: any): Promise<UserEntity> {
    if (userId == null || userId == undefined) {
      throw new ConflictException('Validate user fail');
    }
    const user = await db.users.get(db.users.id(userId));

    if (user) {
      return user.data as UserEntity;
    } else {
      throw new ConflictException('Validate user fail');
    }
  }

  async buildCreateToken(payload: any, expirationTime: string) {
    const encoder = new TextEncoder();
    const key = encoder.encode(process.env.JWT_ACCESS_SECRET);
    return new SignJWT({ payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);
  }

  async generatePayload() {
    return Buffer.from(randomBytes(32)).toString('hex');
  }

  async isEmailTaken(email: string) {
    const providerDatas = await db.providerDatas.query(($) =>
      $.field('email').eq(email),
    );
    if (providerDatas.length > 0) {
      return true;
    }
    return false;
  }

  async generateTonTokens(payload: {
    userId: string;
    address: string;
    network: number;
  }): Promise<Token> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async generateTokens(payload: { userId: string }): Promise<Token> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  private refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
