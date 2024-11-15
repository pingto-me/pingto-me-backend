import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: String,
    description: 'Order by any fields',
    required: false,
    example: 'createdAt:desc',
  })
  @IsOptional()
  orderBy: string;

  @ApiProperty({
    type: Number,
    description: 'Page of pagination',
    required: false,
    example: 1,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Limit of pagination(item per page)',
    required: false,
    example: 10,
  })
  @IsOptional()
  limit: number;
}
