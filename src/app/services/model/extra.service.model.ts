import {CurrencyModel} from './currency.model';

export interface ExtraServiceModel {
  id?: number;
  name: string;
  description?: string;
  chargeType: ExtraServiceChargeType;
  type: ExtraServiceType;
  price: number;
  useCount?: number;
  currency?: CurrencyModel;
}

export enum ExtraServiceChargeType {
  PER_GUEST_PER_NIGHT = "PER_GUEST_PER_NIGHT",
  PER_GUEST = "PER_GUEST",
  PER_USE = "PER_USE",
  PER_ROOM_PER_NIGHT = "PER_ROOM_PER_NIGHT",
  PER_ROOM = "PER_ROOM",
  PER_BOOKING = "PER_BOOKING",
}

export enum ExtraServiceType {
  MEAL = "MEAL",
  GENERAL = "GENERAL",
}
