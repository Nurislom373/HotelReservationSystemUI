import {AmenityModel} from './amenity.model';
import {RoomTypeModel} from './room.type.model';

export interface HotelModel {
  id: number | undefined;
  name: string;
  type: HotelType;
  logoKey: string;
  petAccommodation: boolean;
  daysOff: string[];
  address: string;
  postalCode: string;
  country: string;
  state: string;
  district: string;
  house: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  amenities: AmenityModel[];
  roomTypes: RoomTypeModel[];
}

export enum HotelType {
  LUXURY = "LUXURY",          // Роскошный отель с высоким уровнем сервиса
  BOUTIQUE = "BOUTIQUE",        // Небольшой уникальный дизайнерский отель
  RESORT = "RESORT",          // Курортный отель для отдыха
  BUSINESS = "BUSINESS",        // Отель для деловых поездок
  AIRPORT = "AIRPORT",         // Отель рядом с аэропортом
  MOTEL = "MOTEL",           // Придорожный мотель для автопутешественников
  HOSTEL = "HOSTEL",          // Хостел с общими комнатами, недорогой вариант
  GUEST_HOUSE = "GUEST_HOUSE",     // Гостевой дом, часто семейного типа
  APARTMENT = "APARTMENT",       // Апартаменты или квартиры в аренду
  VILLA = "VILLA",           // Вилла или коттедж
  INN = "INN",             // Небольшой постоялый двор
  LODGE = "LODGE",           // Лодж в горах или на природе
  BED_AND_BREAKFAST = "BED_AND_BREAKFAST", // Отель с завтраком
  ALL_INCLUSIVE = "ALL_INCLUSIVE",   // Отель с системой "всё включено"
  SPA = "SPA",             // СПА-отель с оздоровительными услугами
  CASINO = "CASINO",          // Отель с казино
  CONFERENCE = "CONFERENCE",      // Отель для конференций и мероприятий
  EXTENDED_STAY = "EXTENDED_STAY",   // Отель для длительного проживания
  CAPSULE = "CAPSULE",         // Капсульный отель (очень маленькие комнаты)
  ECO = "ECO",             // Экологичный эко-отель
  FARM_STAY = "FARM_STAY",       // Проживание на ферме
  HERITAGE = "HERITAGE",        // Исторический отель в старинных зданиях
  FLOATING = "FLOATING",        // Плавающий отель (на воде)
  CAVE = "CAVE",            // Пещерный отель
  ICE = "ICE",             // Ледяной отель
  SAFARI = "SAFARI",          // Сафари-лодж в дикой природе
  MONASTERY = "MONASTERY",       // Проживание в монастыре
  TREEHOUSE = "TREEHOUSE"        // Отель на дереве
}
