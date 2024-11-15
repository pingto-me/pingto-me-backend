import { UserLinkType } from '../entities/user-link-type.enum';

export class CreateUserLinkDto {
  userId: string;
  type: UserLinkType;
  platform: string;
  slug: string;
}
