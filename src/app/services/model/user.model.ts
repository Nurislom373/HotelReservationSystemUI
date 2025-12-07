import {TenantModel} from './tenant.model';

export interface UserModel {
  id: number;
  login: string;
  password?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  activated: boolean;
  langKey: string;
  imageUrl: string;
  tenant: TenantModel;
  authorities?: string[];
}
