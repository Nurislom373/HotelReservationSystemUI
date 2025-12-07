import {Injectable} from "@angular/core";
import {FilterModel} from "../models/filter/filter.model";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  /**
   *
   * @param url
   * @param models
   */
  public filterModelJoinUrl(url: string, models: FilterModel[]) {
    if (models === null || models.length === 0) {
      return url;
    }

    const params = models
      .filter(filterModelValue => filterModelValue.value != null)
      .map(filterModelValue => this.internalJoin(filterModelValue))
      .join('&');

    return params ? `${url}?${params}` : url;
  }

  private internalJoin(filterModelValue: FilterModel) {
    return `${filterModelValue.name}=${filterModelValue.value}`;
  }
}
