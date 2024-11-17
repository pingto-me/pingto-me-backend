import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { WalletType } from 'src/utils/interface/wallet-type';

export class SigninPublicAddressInput {
  @ApiProperty({
    type: String,
    description: 'publicAddress',
    required: true,
    example: '0x1234567890',
  })
  @IsNotEmpty()
  publicAddress: string;

  @ApiProperty({
    type: String,
    description: 'signature',
    required: true,
    example: '0x1234567890',
  })
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    enum: WalletType,
    description: 'walletType',
    required: true,
    example: 'bitkubnext',
  })
  @IsOptional()
  walletType: WalletType;
}
