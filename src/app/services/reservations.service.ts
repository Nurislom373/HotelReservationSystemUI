import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReservationModel} from './model/reservation.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends AbstractService<ReservationModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   * Get base URL for reservations API
   */
  getBaseUrl(): string {
    return 'api/reservations';
  }

  /**
   * Get microservice name
   */
  getMicroservice(): string {
    return 'hotelms';
  }
}
