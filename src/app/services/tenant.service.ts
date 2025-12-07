import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantModel} from './model/tenant.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService extends AbstractService<TenantModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   *
   */
  getBaseUrl(): string {
    return 'api/tenants';
  }

  /**
   *
   */
  getMicroservice(): string {
    return 'userms';
  }
}

