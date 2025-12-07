import {HotelModel} from './hotel.model';
import {RoomTypeModel} from './room.type.model';

export interface RoomModel {
  id: number | undefined;
  number: number;
  hotel: HotelModel;
  type: RoomTypeModel;
}
