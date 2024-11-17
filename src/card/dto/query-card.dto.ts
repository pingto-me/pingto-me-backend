import { IsOptional, IsIn, IsNumber } from 'class-validator';
import { CardTypeEnum } from '../types/card-type.enum';

export class QueryCardDto {
  @IsOptional()
  @IsIn(['this_week', 'this_month', 'this_year', 'all'])
  timeRange?: 'this_week' | 'this_month' | 'this_year' | 'all';

  @IsOptional()
  @IsIn(['pingCount'])
  orderBy?: 'pingCount';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';

  @IsOptional()
  @IsIn(['profile', 'nft'])
  cardType?: CardTypeEnum;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
