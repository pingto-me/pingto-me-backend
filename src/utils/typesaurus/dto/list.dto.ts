import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { AuthOptionsDto } from 'src/utils/interface/auth-options.dto';
import { PaginateOptionsDto } from 'src/utils/interface/paginate-options.dto';

export class ListDto extends IntersectionType(
  PaginateOptionsDto,
  AuthOptionsDto,
) {
  @ApiPropertyOptional({
    description: 'Filter by',
    example: [
      {
        type: 'eq',
        field: 'name',
        value: 'John Doe',
      },
    ],
  })
  filterBy?: FilterDto[];
}

export class FilterDto {
  type: string;
  field: string;
  value: string;
}
