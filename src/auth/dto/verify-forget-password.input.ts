import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class VerifyForgetPasswordInput {
  @ApiProperty({
    type: String,
    description: 'Email',
    required: true,
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Forget password code(send via email)',
    required: true,
    example: 'xxx',
  })
  @IsNotEmpty()
  @MinLength(6)
  code: string;

  @ApiProperty({
    type: String,
    description: 'New password',
    required: true,
    example: '1234567890',
  })
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    type: String,
    description: 'Confirm new password',
    required: true,
    example: '1234567890',
  })
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(20)
  confirmPassword: string;
}
