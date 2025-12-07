import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {FilterModel} from "../models/filter/filter.model";
import {QueryCriteria} from "../models/filter/query.criteria";

export interface BaseService<E, ID> {

  /**
   *
   * @param filterModels
   */
  getByQuery(filterModels: FilterModel[]): Observable<HttpResponse<E[]>>;

  /**
   *
   * @param filterModels
   */
  countByQuery(filterModels: FilterModel[]): Observable<HttpResponse<number>>;

  /**
   *
   * @param queryCriteria
   */
  getByQueryPagination(queryCriteria: QueryCriteria): Observable<HttpResponse<E[]>>;

  /**
   *
   */
  getAll(queryParams: string): Observable<HttpResponse<E[]>>;

  /**
   *
   * @param id
   */
  getById(id: ID): Observable<HttpResponse<E>>;

  /**
   *
   * @param body
   */
  create(body: any): Observable<HttpResponse<E>>;

  /**
   *
   * @param body
   * @param id
   */
  update(body: any, id: ID): Observable<HttpResponse<E>>;

  /**
   *
   * @param body
   * @param id
   */
  partialUpdate(body: any, id: ID): Observable<HttpResponse<E>>;

  /**
   *
   * @param id
   */
  delete(id: ID): Observable<HttpResponse<{}>>;

  /**
   *
   */
  count(): Observable<HttpResponse<number>>;
}
