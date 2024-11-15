import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { WalletType } from 'src/utils/interface/wallet-type';

export class ValidatePublicAddressInput {
  @ApiProperty({
    type: String,
    description: 'publicAddress',
    required: true,
    example: '0x1234567890',
  })
  @IsNotEmpty()
  publicAddress: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: WalletType,
    description: 'walletType',
    required: true,
    example: 'bitkubnext',
  })
  walletType: WalletType;
}
