import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class SignupInput {
  @ApiProperty({
    type: String,
    description: 'Email',
    required: true,
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    example: '1234567890',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    type: String,
    description: 'Confirm password',
    required: true,
    example: '1234567890',
  })
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string;
}
