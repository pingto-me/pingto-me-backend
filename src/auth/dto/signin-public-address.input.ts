import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
}
