import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Gender } from 'src/models/gender.enum';
import { Provider } from 'src/models/provider.enum';
import { Role } from 'src/models/role.enum';
import { UserEntity } from 'src/user/entities/user.entity';

export class ValidatePublicAddressRespond {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      provider: { type: 'string' },
      email: { type: 'string' },
      mobilePhone: { type: 'string' },
      title: { type: 'string' },
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      nickname: { type: 'string' },
      gender: { type: 'string' },
      age: { type: 'number' },
      picture: { type: 'string' },
      role: { type: 'string' },
      providerData: { type: 'object' },
      isInitProfile: { type: 'string' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
    example: {
      id: 'xxx',
      provider: Provider.WALLET,
      email: 'test@gmail.com',
      mobilePhone: '0810000000',
      title: 'นาย',
      firstname: 'ทดสอบ',
      lastname: 'สมมุติ',
      nickname: 'แดง',
      gender: Gender.MALE,
      age: 30,
      picture: 'http://xxx/xxx',
      role: Role.USER,
      providerData: {
        id: 'xxx',
        userId: 'xxx',
        provider: Provider.WALLET,
        walletAddress: '0x1234567890',
        nonce: '12345',
        isVerified: true,
        createdAt: '2024-01-11T00:00:00.000Z',
        updatedAt: '2024-01-11T00:00:00.000Z',
      },
      isInitProfile: true,
      createdAt: '2024-01-11T00:00:00.000Z',
      updatedAt: '2024-01-11T00:00:00.000Z',
    },
  })
  user: UserEntity;

  @ApiProperty({ type: String, description: 'Nonce', example: '12345' })
  nonce: string;

  @ApiProperty({ type: String, description: 'Message', example: '12345' })
  msg: string;
}
