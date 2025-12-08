import {CurrencyModel} from '../currency.model';
import {ExtraServiceModel} from '../extra.service.model';
import {CancellationPolicyModel} from '../cancellation.policy.model';

export interface RatePlanModel {
  id?: number;
  name: string;
  shortName: string;
  status: RatePlanStatus;
  type: RatePlanType;
  startDate: Date;
  endDate?: Date | null;
  extraServices?: ExtraServiceModel[];
  currency?: CurrencyModel;
  lateCancellationPolicy?: CancellationPolicyModel;
  earlyCancellationPolicy?: CancellationPolicyModel;
}

export enum RatePlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum RatePlanType {
  BASE = "BASE",
  DERIVED = "DERIVED",
}

