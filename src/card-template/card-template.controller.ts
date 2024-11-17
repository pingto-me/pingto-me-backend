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
import { CardTemplateService } from './card-template.service';
import { CreateCardTemplateDto } from './dto/create-card-template.dto';
import { UpdateCardTemplateDto } from './dto/update-card-template.dto';

@Controller('card-template')
export class CardTemplateController {
  constructor(private readonly cardTemplateService: CardTemplateService) {}

  @Post()
  create(@Body() createCardTemplateDto: CreateCardTemplateDto) {
    return this.cardTemplateService.create(createCardTemplateDto);
  }

  @Get()
  findAll() {
    return this.cardTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardTemplateDto: UpdateCardTemplateDto,
  ) {
    return this.cardTemplateService.update(id, updateCardTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.cardTemplateService.remove(id, userId);
  }
}
