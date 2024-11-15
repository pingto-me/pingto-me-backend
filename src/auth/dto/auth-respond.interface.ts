import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/models/gender.enum';
import { Provider } from 'src/models/provider.enum';
import { Role } from 'src/models/role.enum';
import { Token } from 'src/models/token.interface';
import { UserEntity } from 'src/user/entities/user.entity';

export class AuthRespondInterface {
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
      isInitProfile: { type: 'string' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
    example: {
      id: 'xxx',
      provider: Provider.EMAIL,
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
      isInitProfile: true,
      createdAt: '2024-01-11T00:00:00.000Z',
      updatedAt: '2024-01-11T00:00:00.000Z',
    },
  })
  user: UserEntity;

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
    example: {
      accessToken: 'xxx',
      refreshToken: 'xxx',
    },
  })
  tokens: Token;
}
