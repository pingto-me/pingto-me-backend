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
    const { publicAddress } = payload;
    const user = await this.userService.getUserByPublicAddress(publicAddress);
    const nonce = await this.userService.randomUserNonce(user.id);
    user.providerData.nonce = nonce;
    const msg = `Onetime singin with OTP: ${nonce}`;
    return { user, nonce, msg };
  }

  async signinWithPublicAddress(
    payload: SigninPublicAddressInput,
  ): Promise<AuthRespondInterface> {
    const { publicAddress, signature } = payload;
    const user: UserEntity = await this.userService.getUserByPublicAddress(
      publicAddress,
    );
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
      return user.data;
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

  async getTonProof() {
    const payload = await this.generatePayload();
    const payloadToken = await this.buildCreateToken(payload, '15m');
    return payloadToken;
  }

  async verifyTonProof(token: string) {
    const encoder = new TextEncoder();
    const key = encoder.encode(process.env.JWT_ACCESS_SECRET);
    try {
      const { payload } = await jwtVerify(token, key);
      return payload;
    } catch (e) {
      return null;
    }
  }

  async isTonVerify(proof, account) {
    const payload = {
      address: account.address,
      public_key: account.publicKey,
      proof: {
        ...proof,
        state_init: account.walletStateInit,
      },
    };
    // Logger.debug(JSON.stringify(payload));
    const stateInit = loadStateInit(
      Cell.fromBase64(payload.proof.state_init).beginParse(),
    );
    // const client = new TonClient4({
    //   endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    // });

    // const masterAt = await client.getLastBlock();
    // const result = await client.runMethod(
    //   masterAt.last.seqno,
    //   Address.parse(payload.address),
    //   'get_public_key',
    //   [],
    // );
    // if (result.exitCode !== 0) {
    //   Logger.error(
    //     `Smart contract execution failed with exit code: ${result.exitCode}`,
    //   );
    //   return false;
    // }

    // Logger.debug(JSON.stringify(result));
    // const publicKey = Buffer.from(
    //   result.reader.readBigNumber().toString(16).padStart(64, '0'),
    //   'hex',
    // );
    // if (!publicKey) {
    //   return false;
    // }
    // const wantedPublicKey = Buffer.from(payload.public_key, 'hex');
    // if (!publicKey.equals(wantedPublicKey)) {
    //   return false;
    // }
    const wantedAddress = Address.parse(payload.address);
    const address = contractAddress(wantedAddress.workChain, stateInit);
    if (!address.equals(wantedAddress)) {
      return false;
    }
    return true;
  }

  async signinWithTonWalletAddress(proof, account) {
    const isTokenVerified = await this.verifyTonProof(proof.payload);
    if (!isTokenVerified) {
      throw new UnauthorizedException('Invalid token');
    }
    const isTonVerify = await this.isTonVerify(proof, account);
    if (`${isTonVerify}`.toLowerCase() === 'false') {
      throw new UnauthorizedException('Invalid Ton address');
    }
    const walletAddress = account.address;
    const user = await this.userService.getUserByPublicAddress(walletAddress);

    const tokens = await this.generateTonTokens({
      userId: user.id,
      address: walletAddress,
      network: account.workChain,
    });
    return { user, tokens };
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
