import { UserLinkType } from '../entities/user-link-type.enum';

export class CreateUserLinkDto {
  userId: string;
  type: UserLinkType;
  icon: string;
  platform: string;
  slug: string;
}
