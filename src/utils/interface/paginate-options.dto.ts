import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginateOptionsDto {
  @ApiPropertyOptional({
    description: 'Enable pagination',
    required: false,
    example: false,
  })
  @IsOptional() // Mark as optional
  isPagination?: boolean;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional() // Mark as optional
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional() // Mark as optional
  @Type(() => String)
  lastId?: string;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 999,
    default: 10,
    example: 10,
  })
  @IsOptional() // Mark as optional
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Order by any fields',
    required: false,
    example: 'createdAt:desc',
  })
  @IsOptional() // Mark as optional
  @Type(() => String)
  orderBy?: string;
}
