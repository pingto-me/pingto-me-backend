import { Injectable } from '@nestjs/common';
import { CreateCardTemplateDto } from './dto/create-card-template.dto';
import { UpdateCardTemplateDto } from './dto/update-card-template.dto';

@Injectable()
export class CardTemplateService {
  create(createCardTemplateDto: CreateCardTemplateDto) {
    return 'This action adds a new cardTemplate';
  }

  findAll() {
    return `This action returns all cardTemplate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardTemplate`;
  }

  update(id: number, updateCardTemplateDto: UpdateCardTemplateDto) {
    return `This action updates a #${id} cardTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardTemplate`;
  }
}
