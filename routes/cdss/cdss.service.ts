import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import * as signalR from '@aspnet/signalr';
import { MedicalHistory, NewInfo, FunctionCategory, EventLocation } from './interface/cdss-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth';
import { delay } from 'lodash';
import { ArkService } from '@core/ark/ark.service';
import { RelyOnEnvironmentService } from '@core/rely-on-environment/rely-on-environment.service';
@Injectable()
export class CDSSService {
  performerId: string = '';
  tabChangeBehaviorSubject$: BehaviorSubject<number>; // 切换tab
  isDecisionSupport$: Subject<boolean> = new Subject(); // 是否切换到辅助决策
  popUpFormsSubject$: BehaviorSubject<any> = new BehaviorSubject(true); // 发布当前警告内容
  pushPerformerId$: Subject<any> = new Subject();   // 服务器推送的performerId
  newInfoSubject$: Subject<NewInfo> = new Subject();    // 新消息类型
  connection;
  connetRestartTime: number = 5;    // 单位秒
  constructor(
    private _http: HttpClient,
    private _arkService: ArkService,
    private _relyOnEnvironment: RelyOnEnvironmentService,
    private _auth: AuthService
  ) {
    this.tabChangeBehaviorSubject$ = new BehaviorSubject(1);
    this.getRestartTime().subscribe(data => {
      this.connetRestartTime = Number(data);
    });
  }
  /**
    * 获取量表标签信息
    * @param scaleName
    */
  // tslint:disable-next-line:typedef
  caMore({ name, code, scaleType, type, btnName, modelVersion}): void {
    this.operationLog({
      eventCategory: FunctionCategory.ConditionAnalysis,
      eventLocation: EventLocation.SideBar,
      eventName: btnName === 'btnName' ? `AI-点击“${btnName}”按钮` : `点击“${btnName}”按钮`,
      itemName: name ? name.split('】')[1] : ''
    }).subscribe();
    let openUrl = '';
    const performerId = this.performerId;
    const encoddeName = encodeURI(name);
    let hAndW = {
      width: 902,
      height: 700,
    };
    if (type === 'AI') {
      // 跳转ai
      const popAddress = window.location.protocol + '//' + window.location.host;
      // tslint:disable-next-line:max-line-length
      openUrl = `${popAddress}/aiAnalysis?modelCode=${code}&token=${this._auth.getToken()}&name=${name}&modelVersion=${modelVersion}`;
      this._arkService.popUp({ url: openUrl, ...hAndW });
    } else {
      // 跳转量表
      hAndW = { width: 602, height: 700 };
      this._relyOnEnvironment.getRelyOnEnvironment('Route_Scale').then(address => {
        const popAddress = address;
        this._relyOnEnvironment.getRelyOnEnvironment('Route_ClinicalKnowledge').then(clinicalAddress => {
          const guid = this._auth.guid;
          // tslint:disable-next-line:max-line-length
          openUrl = `${popAddress}/?token=${this._auth.getToken()}&type=${scaleType}&scaleId=${code}&scaleName=${encoddeName}&performerId=${performerId}&clinical=${clinicalAddress}&guid=${guid}`;
          this._arkService.popUp({ url: openUrl, ...hAndW });
        });
      });
    }
  }

  /**
   *初始化数据
   *
   * @memberof PatientCdssService
   */
  initData(): void {
    this.performerId = '';
    window.localStorage.removeItem('popUpForms');
  }
  /**
   *建立连接
   *
   * @memberof CDSSService
   */
  establishConnection(): void {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder().withUrl(`${environment.SERVER_URL}/websocket/notification/chathub`).build();
      this.connection.onclose(async () => {
        await this.startConnection();
      });
      this.connection.on('ReceiveMessage', (_guid, message) => {
        const [ performerId, visitNos ] = message.split('@');
        const visitNoArr = visitNos.split('#');
        if (visitNoArr.indexOf(this._auth.patient.visitId) > -1) {
          this.performerId = performerId;
          this.pushPerformerId$.next();
        }
      });
    }
  }

  // 注册连接
  async startConnection(): Promise<any> {
    try {
      await this.connection.start();
      const guid = this._auth.guid;
      await this.connection.invoke('Register', guid);
    } catch (err) {
      console.log(err);
      delay(() => {
        this.startConnection();
      }, this.connetRestartTime * 1000);
    }
  }

  /**
   *通过连接发送消息到服务器
   *
   * @param {(string | number)} id
   * @param {string} message
   * @memberof CDSSService
   */
  sendConMessage(id: string | number, message: string): void {
    this.connection.invoke('SendMessage', id, message).catch(err => {
      console.error(err);
    });
  }

  /**
   *退出cdss服务
   *
   * @param {*} [params={}]
   * @returns {Observable<any>}
   * @memberof CDSSService
   */
  exitService(params: any = {}): Observable<any> {
    return this._http
      .get<any>('/api/authrize/logout', {
        params,
      })
      .pipe(pluck('data'));
  }

  /**
   *病史信息数据
   *
   * @param {*} params
   * @returns {Observable<MedicalHistory>}
   * @memberof CDSSService
   */
  getMedicalHistory(params: any = {}): Observable<MedicalHistory> {
    return this._http
      .get<MedicalHistory>('/api/performer/medicalhistory/get-patient-medical-history', {
        params,
      })
      .pipe(pluck('data'));
  }

  /**
   *辅助决策
   *
   * @param {*} [params={}]
   * @returns {Observable<any>}
   * @memberof CDSSService
   */
  assistantDecision(params: any = {}): Observable<any> {
    return this._http
      .post('/api/performer/assistantdecision', JSON.stringify({ ...params, performerId: this.performerId }), {
        headers: {
          'accept': 'text/plain',
          'content-type': 'application/json',
        },
      })
      .pipe(pluck('data'));
  }

  getRestartTime(): Observable<any> {
    return this._http
      .get('/api/common/websocketRetry').pipe(pluck('data'));
  }

  // 记录操作日志
  operationLog(params: object): Observable<any> {
    return this._http.post('/api/performer/Operatelog/event', params).pipe(
      pluck('data')
    );
  }
}
