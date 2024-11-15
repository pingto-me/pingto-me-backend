import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleFetcherInput {
  @ApiProperty({
    type: String,
    description: 'Google access token(ถ้ามี)',
    required: false,
    example: 'xxx',
  })
  @IsOptional()
  accessToken?: string;

  @ApiProperty({
    type: String,
    description: 'Google id token(ถ้ามี)',
    required: false,
    example: 'xxx',
  })
  @IsOptional()
  idToken?: string;

  @ApiProperty({
    type: String,
    description: 'Firebase user uid',
    required: true,
    example: 'xxx',
  })
  @IsNotEmpty()
  uid: string;
}
