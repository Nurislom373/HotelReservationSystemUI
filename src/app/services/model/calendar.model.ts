import {RoomTypeModel} from './room.type.model';
import {RoomModel} from './room.model';

export interface CalendarModel {
  id: number | undefined;
  roomType: RoomTypeModel;
  rooms: RoomModel[];
}
