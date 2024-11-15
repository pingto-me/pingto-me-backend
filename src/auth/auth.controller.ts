import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthRespondInterface } from './dto/auth-respond.interface';

import { ValidatePublicAddressInput } from './dto/validate-public-address.input';
import { ValidatePublicAddressRespond } from './dto/validate-public-address.respond';
import { SigninPublicAddressInput } from './dto/signin-public-address.input';
import { SigninTonAddressInput } from './dto/signin-ton-address.input';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Wallet Auth
  @Post('wallet/validate')
  async validateWithPublicAddress(
    @Body() body: ValidatePublicAddressInput,
  ): Promise<ValidatePublicAddressRespond> {
    const result = await this.authService.validateWithPublicAddress(body);
    return result;
  }

  @Post('wallet/signin')
  async signinWithPublicAddress(
    @Body() body: SigninPublicAddressInput,
  ): Promise<AuthRespondInterface> {
    const result = await this.authService.signinWithPublicAddress(body);
    return result;
  }

  // Testing Api
  @Post('wallet/bypass')
  async signinWithBypassPublicAddress(
    @Body() body: SigninPublicAddressInput,
  ): Promise<AuthRespondInterface> {
    const result = await this.authService.signinWithBypassPublicAddress(body);
    return result;
  }

  @Get('ton/proof')
  async getTonProof() {
    return await this.authService.getTonProof();
  }

  @Post('ton/signin')
  async signinWithTonWalletAddress(@Body() body: SigninTonAddressInput) {
    const { account, proof } = body;
    return await this.authService.signinWithTonWalletAddress(proof, account);
  }
}
