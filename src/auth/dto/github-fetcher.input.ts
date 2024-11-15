import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GithubFetcherInput {
  @ApiProperty({
    type: String,
    description: 'Github access token',
    required: true,
    example: 'xxx',
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Firebase user uid',
    required: true,
    example: 'xxx',
  })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    type: 'object',
    description: 'Github provider data',
    required: false,
    properties: {
      providerId: { type: 'string' },
      uid: { type: 'string' },
      displayName: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string' },
      photoURL: { type: 'string' },
    },
    example: {
      providerId: 'github.com',
      uid: 'xxx',
      displayName: 'นายทดสอบ สมมุติ',
      email: 'test@gmail.com',
      phoneNumber: '0810000000',
      photoURL: 'http://xxx/xxx',
    },
  })
  @IsOptional()
  data?: {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
  };
}
