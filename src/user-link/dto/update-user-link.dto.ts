import { PartialType } from '@nestjs/swagger';
import { CreateUserLinkDto } from './create-user-link.dto';

export class UpdateUserLinkDto extends PartialType(CreateUserLinkDto) {}
