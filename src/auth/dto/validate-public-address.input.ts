import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidatePublicAddressInput {
  @ApiProperty({
    type: String,
    description: 'publicAddress',
    required: true,
    example: '0x1234567890',
  })
  @IsNotEmpty()
  publicAddress: string;
}
