import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from './model/room.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends AbstractService<RoomModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   *
   */
  getBaseUrl(): string {
    return 'api/rooms';
  }

  /**
   *
   */
  getMicroservice(): string {
    return 'hotelms';
  }
}
