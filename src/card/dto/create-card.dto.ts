import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  cardName: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  eventId?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false,
    example: false,
  })
  isRedeemed: boolean;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
