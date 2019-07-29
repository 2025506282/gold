import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { DecisionSupportItem, TypeContentItem } from '../interface/cdss-interface';
import { PlatformLocation } from '@angular/common';
import { CDSSService } from '../cdss.service';
import { RelyOnEnvironmentService } from '@core/rely-on-environment/rely-on-environment.service';
import { ArkService } from '@core/ark/ark.service';
import { AuthService } from '@core/auth';

@Injectable()
export class DecisionSupportService {
  quotedData = [
    // 引用过的数据
    {
      type: 'RD',
      data: []
    },
    {
      type: 'CR',
      data: []
    },
    {
      type: 'TP',
      data: []
    }
  ];
  quoted$: Subject<{ type: string; data: any[] }> = new Subject(); // 引用
  reloadDecision$: Subject<any> = new Subject(); //  重新请求decisionSupport数据
  modal$: Subject<any> = new Subject();
  actionSubject$: BehaviorSubject<number> = new BehaviorSubject(0);
  private _popUpData;

  constructor(
    private _http: HttpClient,
    private _arkService: ArkService,
    private _location: PlatformLocation,
    private _cdssService: CDSSService,
    private _authService: AuthService,
    private _relyOnEnvironment: RelyOnEnvironmentService
  ) {
    this.quoted$.subscribe(quoted => {
      const { type, data } = quoted;
      switch (type) {
        case 'RD':
          this.quotedData[0].data = this.quotedData[0].data.concat(data);
          break;
        case 'CR':
          this.quotedData[1].data = this.quotedData[1].data.concat(data);
          break;
        case 'TP':
          this.quotedData[2].data = this.quotedData[2].data.concat(data);
          break;
        default:
          break;
      }
    });
    this._arkService.tabooData$.subscribe(data => {
      const { type, title, content, advice } = data;
      this._arkService.sendMessage({
        type: 'taboo',
        data
      });
      const popItem = this.popUpData;
      this.operateLog({
        moduleCode: '0',
        moduleName: title,
        moduleContent: content,
        userAction: type,
        comment: advice
      }).subscribe(_data => {
      });
      this.deleteTabooAction({ performerId: this._cdssService.performerId, actionIds: [popItem.actionId] }).subscribe(
        _data => {
          this.reloadDecision$.next();
        }
      );
    });
  }

  get popUpData(): any {
    return this._popUpData;
  }

  set popUpData(popUp: any) {
    this._popUpData = popUp;
    if (popUp) {
      const { title, content } = popUp;
      const url = window.location.protocol + '//' + window.location.host + '/assets/messagebox/index.html';
      this._arkService.tabooAlert({ url, title, content });
    }
  }

  initData(): void {
    this.quotedData = [
      {
        type: 'RD',
        data: []
      },
      {
        type: 'CR',
        data: []
      },
      {
        type: 'TP',
        data: []
      }
    ];
  }

  /**
   *获取辅助决策的数据
   *
   * @param
   * @returns {Observable<any>}
   * @memberof PatientCdssService
   */
  getDecisionSupportData(params: any = {}): Observable<any> {
    return this._http
      .get<any>('/api/performer/assistantdecision/get-action', {
        params: { ...params }
      })
      .pipe(pluck('data'));
  }

  /**
   *诊疗监控历史数据
   *
   * @param {*} [params={}]
   * @returns {Observable<any>}
   * @memberof CDSSService
   */
  getDiagnosisMonitorHistory(params: any = {}): Observable<DecisionSupportItem[]> {
    return this._http
      .get<DecisionSupportItem[]>('/api/performer/assistantdecision/get-type-action', {
        params
      })
      .pipe(pluck('data'));
  }

  /**
   *获取ai评分分数
   *
   * @returns {Observable<any>}
   * @memberof DecisionSupportService
   */
  getAiScore(params: any = {}): Observable<any> {
    return this._http
        .post<any>('/api/ai/aimodel/get-aimodel-simple', JSON.stringify(params), {
        headers: {
          'accept': 'text/plain',
          'content-type': 'application/json'
        }
      })
      .pipe(pluck('data'));
  }

  /**
   *获取量表分数
   *
   * @param {*} performerId
   * @returns {Observable<any>}
   * @memberof DecisionSupportService
   */
  getScaleScore2(params: any = {}): Observable<any> {
    return this._http.post<any>('/api/scale/scale/get-scale', params).pipe(pluck('data'));
  }

  /**
   * AI评估-获取ai模型基础数据
   */
  getAiBasicData(modelCode: string, modelVersion: string): Observable<any> {
    return this._http.post('/api/ai/aimodel/get-aimodel', { modelCode, modelVersion }).pipe(pluck('data'));
  }

  /**
   * AI评估-根据obsTime获取ai模型关键变量信息
   * @param obsTime
   * @param modelCode
   * @param visitId
   * @param modelVersion
   */
  getKeyVariables(obsTime: string, modelCode: string, visitId: string, modelVersion: string): Observable<any> {
    return this._http.post(`/api/ai/AIModel/get-aidata`, { obsTime, modelCode, visitId, modelVersion }).pipe(pluck('data'));
  }

  /**
   * AI评估-获取ai模型分数的解释模型信息
   * @param obsTime
   * @param modelCode
   * @param visitId
   * @param modelVersion
   */
  getAiExplainData(obsTime: string, modelCode: string, visitId: string, modelVersion: string): Observable<any> {
    return this._http.post(`/api/ai/AIModel/get-aiLime`, { obsTime, modelCode, visitId, modelVersion }).pipe(pluck('data'));
  }

  /**
   * AI评估-获取单点模型历史分数信息
   * @param page
   * @param modelCode
   * @param modelVersion
   */
  getAiHistoryData(page: any, modelCode: any, modelVersion:string): Observable<any> {
    return this._http.post(`/api/ai/AIModel/get-aiHisData`, { page, modelCode, modelVersion }).pipe(pluck('data'));
  }

  /**
   * AI评估-获取滚动模型的历史分数信息
   * @param visitId
   * @param modelCode
   */
  getAiHistoryDataById(visitId: any, modelCode: any): Observable<any> {
    return this._http.post(`/api/ai/aimodel/get-aiHisData2`, { visitId, modelCode }).pipe(pluck('data'));
  }

  /**
   * AI评估-获取滚动模型的总览数据
   * @param modelCode
   * @param modelVersion
   */
  getGeneralData(modelCode: string, modelVersion: string): Observable<any> {
    return this._http.post(`/api/ai/aimodel/get-aiTotalData`, { modelCode, modelVersion }).pipe(pluck('data'));
  }

  // 删除禁忌actions
  deleteTabooAction(params: any = {}): Observable<any> {
    return this._http
      .post('/api/performer/assistantdecision/block-action', JSON.stringify(params), {
        headers: {
          'accept': 'text/plain',
          'content-type': 'application/json'
        }
      })
      .pipe(pluck('data'));
  }

  // 操作日志
  operateLog(params: any = {}): Observable<any> {
    return this._http
      .post('/api/performer/Operatelog/log', JSON.stringify(params), {
        headers: {
          'accept': 'text/plain',
          'content-type': 'application/json'
        }
      })
      .pipe(pluck('data'));
  }

  // 打开文档连接
  openDocument(data: TypeContentItem): void {
    if (data.linkKey) {
      this._relyOnEnvironment.getFileUrl(data.linkKey).subscribe(_data => {
        if (_data) {
          this._arkService.openInBrowser({ url: _data });
        }
      });
    } else if (data.materialLink) {
      const type = data.materialLink.split(':')[0];
      if (type === 'query') {
        const id = data.materialLink.split(':')[1];
        this._relyOnEnvironment.getRelyOnEnvironment('Route_ClinicalKnowledge').then(address => {
          this._arkService.openInBrowser({ url: this.addToken(`${address}/knowledge-search/detail/81/${id}`) });
        });
      } else if (type === 'http' || type === 'https') {
        this._arkService.openInBrowser({ url: this.addToken(data.materialLink) });
      }
    }
  }

  addToken(url: string): string {
    if (url.split('?').length === 2) {
      return url + `&tokenFromCdss=${this._authService.getToken()}`;
    } else {
      return url + `?tokenFromCdss=${this._authService.getToken()}`;
    }
  }

  // 反馈问题
  feedback(id: string, feedbackTag: string, feedbackRemark: string): Observable<any> {
    const params = new HttpParams()
      .set('id', id)
      .set('feedbackTag', feedbackTag)
      .set('feedbackRemark', feedbackRemark);
    return this._http
      .post(`/api/performer/assistantdecision/${id}/action-feedback`, params.toString(), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(
        pluck('data')
      );
  }
}
