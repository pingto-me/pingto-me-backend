import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export abstract class BaseEntityModel {
  @ApiProperty({
    type: String,
    description: 'Id',
    required: true,
    example: 'xxx',
  })
  id: string;

  @ApiProperty({
    type: Date,
    description: 'Created at',
    required: false,
    example: '2024-01-11T00:00:00.000Z',
    default: new Date(),
  })
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    type: Date,
    description: 'Update at',
    required: false,
    example: '2024-01-11T00:00:00.000Z',
    default: new Date(),
  })
  @Type(() => Date)
  updatedAt?: Date;
}
