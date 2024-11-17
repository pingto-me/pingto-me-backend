import { ApiProperty } from '@nestjs/swagger';
import { CardTypeEnum } from '../types/card-type.enum';

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

  @ApiProperty({ enum: CardTypeEnum, required: true })
  cardType: CardTypeEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
