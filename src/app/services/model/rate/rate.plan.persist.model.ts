import {RatePlanModel} from './rate.plan.model';
import {RatePlanPriceRoomTypeModel} from './rate.plan.price.room.type.model';
import {RatePlanRatesPersistModel} from './rate.plan.rates.persist.model';

export interface RatePlanPersistModel {
  ratePlan: RatePlanModel;
  roomType: RatePlanPriceRoomTypeModel;
  rates: RatePlanRatesPersistModel[];
}
