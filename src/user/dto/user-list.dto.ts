import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AuthOptionsDto } from 'src/utils/interface/auth-options.dto';
import { PaginateOptionsDto } from 'src/utils/interface/paginate-options.dto';

export class UserListDto extends IntersectionType(
  PaginateOptionsDto,
  AuthOptionsDto,
) {
  @ApiPropertyOptional({
    description: 'Filter by email',
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  email?: string;
}
