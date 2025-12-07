import {FilterModel} from "./filter.model";

export interface QueryCriteria {
  size: number;
  page: number;
  sort?: string;
  filterModels?: FilterModel[];
}
