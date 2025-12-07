import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoomTypeModel} from './model/room.type.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService extends AbstractService<RoomTypeModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   *
   */
  getBaseUrl(): string {
    return 'api/room-types';
  }

  /**
   *
   */
  getMicroservice(): string {
    return 'hotelms';
  }
}

