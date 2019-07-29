import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentViewService {

  constructor(
    private _http: HttpClient,
  ) { }
  /**
     *获取本次就诊ai模型
     *
     * @param {*} [params={}]
     * @returns {Observable<any>}
     * @memberof CDSSService
     */
    getVisitAimodel(params: any = {}): Observable<any> {
      return this._http
        .get<any>('/api/ai/aimodel/get-visit-aimodel', {
          params,
        })
        .pipe(pluck('data'));
    }
  /**
     *获取本次就诊量表最新评分
     *
     * @param {*} [params={}]
     * @returns {Observable<any>}
     * @memberof CDSSService
     */
  getVisitScale(params: any = {}): Observable<any> {
    return this._http
      .get<any>('/api/scale/scale/get-visit-scale', {
        params,
      })
      .pipe(pluck('data'));
  }
}
