import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MicroserviceConfigService {

  /**
   *
   * @param api
   * @param microservice
   */
  getEndpointFor(api: string, microservice?: string): string {
    let GATEWAY_URL = this.getGatewayUrl();
    if (microservice) {
      return `${GATEWAY_URL}/services/${microservice}/${api}`;
    }
    return `${GATEWAY_URL}${api}`;
  }

  /**
   *
   */
  getGatewayUrl(): string {
     return "http://localhost:8080";
  }
}
