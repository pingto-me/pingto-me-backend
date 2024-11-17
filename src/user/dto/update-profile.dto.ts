import { IsOptional } from 'class-validator';

export class UpdateUserProfile {
  title?: string;
  firstName?: string;
  lastName?: string;
  profileImage: string;
  bannerImage: string;
  company?: string;
  position?: string;
  @IsOptional()
  bio?: string;
}
