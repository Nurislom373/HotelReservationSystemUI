import {RatePlanRatesPricesPersistModel} from './rate.plan.rates.prices.persist.model';

export interface RatePlanRatesPersistModel {
  isExtra: boolean;
  guestCount?: number | null;
  prices: RatePlanRatesPricesPersistModel[];
}
