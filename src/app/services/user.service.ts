import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UserModel} from './model/user.model';
import {AbstractService} from './base/services/abstract.service';
import {FilterService} from './base/services/filter.service';
import {MicroserviceConfigService} from './base/services/microservice.config.service';
import {QueryCriteria} from './base/models/filter/query.criteria';
import {Observable} from 'rxjs';
import {ChangePasswordModel} from './model/change.password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService<UserModel, number> {

  constructor(httpClient: HttpClient, filterService: FilterService, microserviceConfig: MicroserviceConfigService) {
    super(httpClient, filterService, microserviceConfig);
  }

  public changePassword(changePassword: ChangePasswordModel): Observable<HttpResponse<Object>> {
    let url = super.getEndpointByBaseURL("api/account/change-password-with-login");
    return this.httpClient.post(url, changePassword, {observe: 'response'})
  }

  override getByQueryPagination(queryCriteria: QueryCriteria): Observable<HttpResponse<UserModel[]>> {
    let url = this.filterService.filterModelJoinUrl(this.getEndpoint() + "/read-only", queryCriteria.filterModels!);
    let paginationUrl = this.joinPagination(url, queryCriteria.size, queryCriteria.page, queryCriteria.sort);
    return this.httpClient.get<UserModel[]>(paginationUrl, {observe: 'response'});
  }

  override create(body: any): Observable<HttpResponse<UserModel>> {
    let endpoint = super.getEndpointByBaseURL("api/register");
    return this.httpClient.post<UserModel>(endpoint, body, {observe: 'response'});
  }

  override update(body: any): Observable<HttpResponse<UserModel>> {
    let endpoint = this.getEndpoint() + "/update";
    return this.httpClient.put<UserModel>(`${endpoint}`, body, {observe: 'response'});
  }

  getBaseUrl(): string {
    return 'api/users';
  }

  getMicroservice(): string {
    return 'userms';
  }
}

