import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoleModel} from './model/role.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends AbstractService<RoleModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  /**
   *
   */
  getBaseUrl(): string {
    return 'api/roles';
  }

  /**
   *
   */
  getMicroservice(): string {
    return 'userms';
  }
}

