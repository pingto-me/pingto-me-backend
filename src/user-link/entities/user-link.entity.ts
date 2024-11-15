import { UserLinkType } from './user-link-type.enum';

export class UserLink {
  id: string;
  userId: string;
  type: UserLinkType;
  icon: string;
  platform: string;
  slug: string;
  fullLink: string;

  createdAt: Date;
  updatedAt: Date;
}
