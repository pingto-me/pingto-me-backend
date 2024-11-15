import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgetPasswordInput {
  @ApiProperty({
    type: String,
    description: 'Email',
    required: true,
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
