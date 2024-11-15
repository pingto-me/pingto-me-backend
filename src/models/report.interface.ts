export interface Report {
  id: string;
  reportByUserId: string;
  title: string;
  description: string;
  phoneNumber: string;
  categories: string[];
  isScam: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
