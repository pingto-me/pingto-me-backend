/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPointLogCategory } from './user-point-log-category.enum';
import { UserPointLogType } from './user-point-log-type.enum';

export interface UserPointLog {
  id: string;
  userId: string;
  refByUserId?: string;
  refRawData?: any;
  point: number;
  type: UserPointLogType;
  category: UserPointLogCategory;

  createdAt?: Date;
  updatedAt?: Date;
}
