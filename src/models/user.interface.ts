import { Provider } from './provider.enum';
import { Role } from './role.enum';
import { Gender } from './gender.enum';

export interface User {
  id: string;
  provider?: Provider;
  email?: string;
  mobilePhone?: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  gender?: Gender;
  age?: number;
  picture?: string;
  profileImage?: string;
  bannerImage?: string;
  role: Role;
  isInitProfile?: boolean;
  referralCode?: string;
  point?: number;
  isSkipReference?: boolean;
  uniqShorten?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
