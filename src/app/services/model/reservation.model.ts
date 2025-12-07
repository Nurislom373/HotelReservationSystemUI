import {RoomModel} from './room.model';
import {ReservationUserModel} from './reservation.user.model';

export interface ReservationModel {
  id: number | undefined;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: ReservationStatus;
  user: ReservationUserModel;
  room: RoomModel;
}

export enum ReservationStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT_ACTIVE",
}
