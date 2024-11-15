import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Req() req: any, @Body() createEventDto: CreateEventDto) {
    createEventDto.ownerId = req.user.id;
    const event = await this.eventService.create(createEventDto);
    return event;
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    const events = await this.eventService.findAllByUserId(userId);
    // convert events to array of Event
    return events.docs.map((event) => event.data());
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const event = await this.eventService.findOneByIdAndUserId(id, userId);
    return event;
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const userId = req.user.id;
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.eventService.remove(id, userId);
  }
}
