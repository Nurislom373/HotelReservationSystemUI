import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ExtraServiceModel} from './model/extra.service.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraServiceService extends AbstractService<ExtraServiceModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  getBaseUrl(): string {
    return 'api/extra-services';
  }

  getMicroservice(): string {
    return 'rateplanms';
  }
}
