import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HotelModel} from './model/hotel.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService extends AbstractService<HotelModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   *
   */
  getBaseUrl(): string {
    return 'api/hotels';
  }

  /**
   *
   */
  getMicroservice(): string {
    return 'hotelms';
  }
}

