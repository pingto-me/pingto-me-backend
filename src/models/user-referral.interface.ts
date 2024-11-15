export interface UserReferral {
  id: string;
  userId: string;
  refByUserId: string;
  referralCode: string;

  createdAt?: Date;
  updatedAt?: Date;
}
