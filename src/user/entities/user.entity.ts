import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/models/gender.enum';
import { Provider } from 'src/models/provider.enum';
import { Role } from 'src/models/role.enum';
import { User } from 'src/models/user.interface';
import { ProviderDataEntity } from './provider-data.entity';
import { BaseEntityModel } from 'src/common/models/base.entity.model';
import { IsOptional } from 'class-validator';
import { WalletType } from 'src/utils/interface/wallet-type';

export class UserEntity extends BaseEntityModel implements User {
  @ApiProperty({
    type: String,
    description: `Sign-up provider [${Provider.EMAIL}, ${Provider.GOOGLE}, ${Provider.GITHUB}]`,
    required: false,
    example: Provider.EMAIL,
  })
  provider?: Provider;

  walletType?: WalletType;
  @ApiProperty({
    type: String,
    description: 'Email',
    required: false,
    example: 'test@gmail.com',
  })
  email?: string;

  @ApiProperty({
    type: String,
    description: 'Mobile phone',
    required: false,
    example: '0810000000',
  })
  mobilePhone?: string;

  @ApiProperty({
    type: String,
    description: 'Title',
    required: false,
    example: 'นาย',
  })
  title?: string;

  @ApiProperty({
    type: String,
    description: 'Firstname',
    required: false,
    example: 'ทดสอบ',
  })
  firstname?: string;

  @ApiProperty({
    type: String,
    description: 'Lastname',
    required: false,
    example: 'สมมุติ',
  })
  lastname?: string;

  @ApiProperty({
    type: String,
    description: 'Nickname',
    required: false,
    example: 'แดง',
  })
  nickname?: string;

  @ApiProperty({
    type: String,
    description: `Gender [${Gender.MALE}, ${Gender.FEMALE}]`,
    required: false,
    example: Gender.MALE,
  })
  gender?: Gender;

  @ApiProperty({
    type: Number,
    description: 'Age',
    required: false,
    example: 30,
  })
  age?: number;

  @ApiProperty({
    type: String,
    description: 'Picture',
    required: false,
    example: 'http://xxx/xxx',
  })
  picture?: string;

  @ApiProperty({
    type: String,
    description: `Role [${Role.USER}, ${Role.ADMIN}]`,
    required: true,
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      provider: { type: 'string' },
      walletAddress: { type: 'string' },
      nonce: { type: 'string' },
      isVerified: { type: 'boolean' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
    example: {
      id: 'xxx',
      userId: 'xxx',
      provider: Provider.WALLET,
      walletAddress: '0x1234567890',
      nonce: '12345',
      isVerified: true,
      createdAt: '2024-01-11T00:00:00.000Z',
      updatedAt: '2024-01-11T00:00:00.000Z',
    },
  })
  providerData?: ProviderDataEntity;

  @ApiProperty({
    type: String,
    description: 'Refferal code',
    required: false,
    example: '123456',
  })
  referralCode?: string;

  @ApiProperty({
    type: Number,
    description: 'Point',
    required: false,
    example: 100,
    default: 0,
  })
  point?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Init profile?',
    required: false,
    example: true,
  })
  isInitProfile?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Skip reference?',
    required: false,
    example: true,
  })
  isSkipReference?: boolean;
}
