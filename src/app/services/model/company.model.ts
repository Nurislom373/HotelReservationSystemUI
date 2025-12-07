export interface CompanyModel {
  id: number | undefined;
  inn: number;
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}
