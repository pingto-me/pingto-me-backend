import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Logger,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { QueryCardDto } from './dto/query-card.dto';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
const logger = new Logger('CardController');
@ApiTags('Card')
@Controller('cards')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) {}

  @Post('increase-ping-count/:code')
  increasePingCountByCode(@Param('code') code: string) {
    return this.cardService.increasePingCountByCode(code);
  }

  @Auth()
  @Post('claim-card/:code')
  claimCardByCode(
    @Req() req: any,
    @Param('code') code: string,
    // @Param('pinCode') pinCode: string,
  ) {
    const authUserId = req.user.id;
    return this.cardService.claimCardByCode(authUserId, code);
  }

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll(@Query() query: QueryCardDto) {
    return this.cardService.findAll(query);
  }

  @Get('code/:code')
  async findOneByCode(@Param('code') code: string) {
    logger.log('findOneByCode code', code);
    const result = {
      event: null,
      profile: null,
    };
    const cardData = await this.cardService.findOneByCode(code);
    // get eventData by cardData.eventId
    if (cardData && cardData.eventId) {
      const eventData = await this.eventService.findOne(cardData.eventId);
      result.event = eventData;
    }
    if (cardData && cardData.userId) {
      const cardProfileData = await this.userService.getUserProfileCard(
        cardData.userId,
      );
      result.profile = cardProfileData;
    }
    return { ...cardData, ...result };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(id);
  }

  //generate random card amount
  @Post('generate-random-card')
  async generateRandomCard(@Body() body: { amount: number }) {
    return this.cardService.generateRandomCard(body.amount);
  }
  @Post('generate-prototype')
  async generateProtoType(){
    return this.cardService.generateProtoType();
  }

  @Post('update-event-id')
  async updateEventId(){
    return this.cardService.updateAllCardEventId();
  }
  
}
