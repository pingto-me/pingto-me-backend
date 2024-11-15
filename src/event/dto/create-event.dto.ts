import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EventType } from '../entities/event-type.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    description: 'The name of the event',
    example: 'Event Name',
  })
  name: string;

  @IsString()
  @ApiProperty({
    name: 'description',
    description: 'The description of the event',
    example: 'Event Description',
  })
  description: string;

  @ApiProperty({
    name: 'eventType',
    description: 'The type of the event',
    enum: EventType,
  })
  eventType: EventType;

  @ApiProperty({
    name: 'isEnable',
    description: 'The status of the event',
    example: true,
    default: false,
  })
  isEnable = true;

  // replace in controller
  ownerId: string;
}
