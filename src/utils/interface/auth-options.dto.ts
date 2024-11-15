import { ApiHideProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class AuthOptionsDto {
  @ApiHideProperty()
  @IsOptional() // Mark as optional
  @Type(() => String)
  authByUserId?: string;
}
