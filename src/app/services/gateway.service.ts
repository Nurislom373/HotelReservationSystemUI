import {Injectable} from '@angular/core';

/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private readonly URL_PREFIX = "http://localhost:8080";
  private readonly USER_SERVICE_URL_PREFIX = "/services/userms";
  private readonly ORGANIZATION_SERVICE_URL_PREFIX = "/services/organizationms";

  /**
   *
   */
  public getHttpUrlPrefix() {
    return this.URL_PREFIX;
  }

  /**
   *
   */
  public getUserServiceUrlPrefix() {
    return this.URL_PREFIX + this.USER_SERVICE_URL_PREFIX;
  }

  /**
   *
   */
  public getOrganizationServiceUrlPrefix() {
    return this.URL_PREFIX + this.ORGANIZATION_SERVICE_URL_PREFIX;
  }
}
