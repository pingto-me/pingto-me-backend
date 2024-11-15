import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SaveAccountRawDataDto {
  @ApiProperty({
    example: {},
    required: false,
  })
  @IsOptional()
  rawData?: string;
}
