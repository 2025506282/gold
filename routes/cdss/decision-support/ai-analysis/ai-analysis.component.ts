import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AiModelBasis,
  BasisItem,
  DataStatus,
  EventCategory,
  EventLocation,
  FunctionCategory,
  HistoryTrendIten,
  KeyVariableItem,
  LiteratureItem
} from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth';
import { ArkService } from '@core/ark/ark.service';
import { RelyOnEnvironmentService } from '@core/rely-on-environment/rely-on-environment.service';
import { CDSSService } from '../../cdss.service';

@Component({
  selector: 'cds-ai-analysis',
  templateUrl: './ai-analysis.component.html',
  styleUrls: ['./ai-analysis.component.less']
})
export class AiAnalysisComponent implements OnInit, OnDestroy {
  aiModelBasicData: AiModelBasis;
  latestVisitData: { obsTime: string, scale: number, modelVersion: string } = {
    obsTime: undefined,
    scale: undefined,
    modelVersion: undefined
  }; // 最近一次就诊数据
  someVisitData: { obsTime: string, scale: number, modelVersion: string } = {
    obsTime: undefined,
    scale: undefined,
    modelVersion: undefined
  }; // 某一次就诊数据
  isShowRecommend: boolean = false;
  keyVariables: KeyVariableItem[]; // 关键变量
  timeLineData: object[] = []; // 时间轴数据
  isOpenTimeLine: boolean = false;
  basis: BasisItem[];
  historyData: HistoryTrendIten[]; // 单点模型历史数据
  generalData: any; // 滚动模型总览数据
  scrollHistoryData: object[]; // 滚动模型折线图数据
  subscription: Subscription = new Subscription();
  modelCode: string;
  name: string; // AI模型名称
  visitId: string; // 就诊id
  dataLoadingStatus = {
    echartsData: DataStatus.NORMAL,  // ecarts数据加载状态
    explainData: DataStatus.LOADING,   // 解释模型数据加载状态
    // variableData: DataStatus.LOADING // 关键变量数据加载状态
    basicData: DataStatus.LOADING   // 页面基础数据
  };
  echartsErrorType: string = 'line'; // 加载数据失败的echarts的类型（折线图line、柱状图bar）

  constructor(
    private _arkService: ArkService,
    private _service: DecisionSupportService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private _relyOnEnvironment: RelyOnEnvironmentService,
    private _cdss: CDSSService
  ) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      const { modelCode, token, name, modelVersion } = queryParams;
      this.modelCode = modelCode;
      this.auth.setToken(token);
      this.name = name;
      this.latestVisitData.modelVersion = modelVersion;
      // console.log(modelCode, token);
    });
    if (this._arkService.isBrowser) {
      this.subscription.add(
        this._arkService.loadBridgeScript().subscribe()
      );
    }
  }

  ngOnInit(): void {
    this.getAiBasicData(true, this.latestVisitData.modelVersion);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * 时间轴item切换
   * @param itemInfo
   */
  public selectChange(itemInfo: any): void {
    // console.log('itemInfo:', itemInfo);
    this.someVisitData.scale = this.historyData[itemInfo.index].score;
    this.someVisitData.obsTime = `${itemInfo.item.date} ${itemInfo.item.time}`;
    this.getDateByObsTime();
  }

  /**
   * 监听折线图点击事件
   * @param data： {score: number, obsTime: string}
   */
  public lineChartSelectChange(data: { score: number, obsTime: string, modelVersion: string }): void {
    this.someVisitData.scale = data.score;
    this.someVisitData.obsTime = data.obsTime;
    // 对比上次的版本号，不相等则需要重新获取模型说明、参考文献数据
    if (this.someVisitData.modelVersion !== data.modelVersion) {
      this.someVisitData.modelVersion = data.modelVersion;
      this.getAiBasicData(false, this.someVisitData.modelVersion);
    }
    this.someVisitData.modelVersion = data.modelVersion;
    this.getDateByObsTime();
    // tslint:disable-next-line:max-line-length
    this.eventLog(FunctionCategory.ConditionAnalysis, EventLocation.AiDetail, EventCategory.ClickHistoryTrendEcharts, data.obsTime + ' ' + data.score);
  }

  /**
   * 监听就诊id变更
   * @param visitId
   * @param btnName
   */
  public visitIdChange({ visitId, btnName }: { visitId: string, btnName: string }): void {
    if (visitId === 'zl') {
      this.getBarEchartsData();
    } else {
      // 如果无visitId, 则表明无数据
      if (!visitId) {
        this.isShowRecommend = false;
        this.latestVisitData.scale = null;
        this.someVisitData.scale = null;
        this.dataLoadingStatus.explainData = DataStatus.NODATA;
        this.visitId = '';
        // this.dataLoadingStatus.variableData = DataStatus.NODATA;
        this.dataLoadingStatus.echartsData = DataStatus.NODATA;
        return;
      }
      this.visitId = visitId;
      this.getAiHistoryDataById();
    }

    this.eventLog(FunctionCategory.ConditionAnalysis, EventLocation.AiDetail, `点击“${btnName}”`, this.name);
  }

  // 打开参考链接
  public toLiteraturePage(data: LiteratureItem): void {
    this._relyOnEnvironment.getFileUrl(encodeURI(data.url)).subscribe(_url => {
      this._arkService.openInBrowser({ url: _url });
    });

    this.eventLog(FunctionCategory.ConditionAnalysis, EventLocation.AiDetail, EventCategory.ClickLiterature, data.name);
  }

  // 显示隐藏时间轴
  public toggleTimeLine(): void {
    this.isOpenTimeLine = !this.isOpenTimeLine;
  }

  // 关闭弹窗
  public closeModal(): void {
    this._arkService.closePopup();

    this.eventLog(FunctionCategory.ConditionAnalysis, EventLocation.AiDetail, EventCategory.CloseAi, this.name);
  }

  // 请求ai模型基础数据（模型名称，最新分数，危险划分刻度，模型说明，参考文献等等），成功后请求后续其他接口
  public getAiBasicData(flag: boolean = true, modelVersion: string): void {
    this.dataLoadingStatus.basicData = DataStatus.LOADING;
    this.subscription.add(this._service.getAiBasicData(this.modelCode, modelVersion).subscribe(data => {
      if (data) {
        this.dataLoadingStatus.basicData = DataStatus.NORMAL;
        this.aiModelBasicData = data;
        if (data.aiModel) {
          this.someVisitData.obsTime = data.aiModel.obsTime;
          this.someVisitData.scale = data.aiModel.score;
          this.someVisitData.modelVersion = data.aiModel.version;
          if (data.aiModel.variable) {
            this.keyVariables = data.aiModel.variable;
            // this.dataLoadingStatus.variableData = DataStatus.NORMAL;
            this.isShowRecommend = this.aiModelBasicData.aiModel.variable.some(item => item.exit === false);
          } else {
            // this.dataLoadingStatus.variableData = DataStatus.NODATA;
          }
          this.visitId = data && data.patient && data.patient.visitId;
          // 是否请求后续接口
          if (flag) {
            if (data.aiModel.modelType === '1') {
              // 获取滚动模型数
              this.getGeneralData();
            } else if (data.aiModel.modelType === '0') {
              // 获取单点模型数据
              this.getTimeLineData();
              this.loadExplainData(this.latestVisitData.obsTime, this.latestVisitData.modelVersion);
            }
          }
        }
      } else {
        this.dataLoadingStatus.basicData = DataStatus.NODATA;
      }
    }, () => {
      this.dataLoadingStatus.basicData = DataStatus.NODATA;
    }));
  }

  // 根据obsTime获取相关数据
  public getDateByObsTime(): void {
    this.loadVariableData(this.someVisitData.obsTime, this.someVisitData.modelVersion);
    this.loadExplainData(this.someVisitData.obsTime, this.someVisitData.modelVersion);
  }

  /**
   * 获取某次就诊信息
   */
  public getAiHistoryDataById(): void {
    this.dataLoadingStatus.echartsData = DataStatus.LOADING;
    this.subscription.add(this._service.getAiHistoryDataById(this.visitId, this.modelCode)
      .subscribe(data => {
        if (data && data.length) {
          // 切换就诊时，默认加载最新的关键变量以及预警依据数据
          this.latestVisitData.obsTime = data[0].obsTime;
          this.latestVisitData.scale = data[0].score;
          this.someVisitData = { ...this.latestVisitData };
          this.getDateByObsTime();

          this.scrollHistoryData = data.reverse();
          this.dataLoadingStatus.echartsData = DataStatus.NORMAL;
        } else {
          this.isShowRecommend = false;
          this.latestVisitData.scale = null;
          this.dataLoadingStatus.explainData = DataStatus.NODATA;
          // this.dataLoadingStatus.variableData = DataStatus.NODATA;
          this.dataLoadingStatus.echartsData = DataStatus.NODATA;
        }
      }, () => {
        this.isShowRecommend = false;
        this.latestVisitData.scale = null;
        this.dataLoadingStatus.explainData = DataStatus.NODATA;
        // this.dataLoadingStatus.variableData = DataStatus.NODATA;
        this.dataLoadingStatus.echartsData = DataStatus.NODATA;
        this.echartsErrorType = 'line';
      })
    );
  }

  /**
   * 获取解释模型数据（预警依据）
   */
  public loadExplainData(obsTime: string, modelVersion: string): void {
    this.dataLoadingStatus.explainData = DataStatus.LOADING;
    this.subscription.add(this._service.getAiExplainData(obsTime, this.modelCode, this.visitId, modelVersion).subscribe(data => {
      // console.log(data);
      if (data && data.basis && data.basis.length) {
        this.basis = data.basis;
        this.dataLoadingStatus.explainData = DataStatus.NORMAL;
      } else {
        this.dataLoadingStatus.explainData = DataStatus.NODATA;
      }
    }, () => {
      this.dataLoadingStatus.explainData = DataStatus.ERROR;
    }));
  }

  // 查看最新一次预测结果
  public getLatestResult(): void {
    this.someVisitData.scale = this.latestVisitData.scale;
    this.loadVariableData(this.latestVisitData.obsTime, this.latestVisitData.modelVersion);
    this.loadExplainData(this.latestVisitData.obsTime, this.latestVisitData.modelVersion);
    // 对比上次的版本号，不相等则需要重新获取模型说明、参考文献数据
    if (this.latestVisitData.modelVersion !== this.someVisitData.modelVersion) {
      this.getAiBasicData(false, this.latestVisitData.modelVersion);
    }
    // tslint:disable-next-line:max-line-length
    this.eventLog(FunctionCategory.ConditionAnalysis, EventLocation.AiDetail, EventCategory.ToPredictResult, `${this.name}(${this.latestVisitData.modelVersion})`);
  }

  /**
   * 获取关键变量数据
   */
  public loadVariableData(obsTime: string, modelVersion: string): void {
    // this.dataLoadingStatus.variableData = DataStatus.LOADING;
    this.subscription.add(this._service.getKeyVariables(obsTime, this.modelCode, this.visitId, modelVersion).subscribe(data => {
      if (data && data.variable && data.variable.length) {
        this.keyVariables = data.variable;
        this.isShowRecommend = data.variable.some(item => item.exit === false);
        // this.dataLoadingStatus.variableData = DataStatus.NORMAL;
      } else {
        this.keyVariables = [];
        this.isShowRecommend = false;
        // this.dataLoadingStatus.variableData = DataStatus.NODATA;
      }
    }, () => {
      this.keyVariables = [];
      this.isShowRecommend = false;
      // this.dataLoadingStatus.variableData = DataStatus.NODATA;
    }));
  }

  /**
   * 获取单点模型历史分数信息
   */
  public getTimeLineData(): void {
    this._service.getAiHistoryData(0, this.modelCode, this.latestVisitData.modelVersion).subscribe(data => {
      if (data && data.history) {
        this.historyData = data.history.reverse();
        this.historyData.map(item => {
          this.timeLineData.push({
            text: item.tip,
            date: item.obsTime.split(' ')[0],
            time: item.obsTime.split(' ')[1]
          });
        });
      }
    });
  }

  /**
   * 加载柱状图数据
   */
  public getBarEchartsData(): void {
    this.dataLoadingStatus.echartsData = DataStatus.LOADING;
    this.subscription.add(this._service.getGeneralData(this.modelCode, this.latestVisitData.modelVersion).subscribe(data => {
      if (data) {
        this.generalData = data;
        this.dataLoadingStatus.echartsData = DataStatus.NORMAL;
      } else {
        this.dataLoadingStatus.echartsData = DataStatus.NODATA;
      }
    }, () => {
      this.dataLoadingStatus.echartsData = DataStatus.NODATA;
      this.echartsErrorType = 'bar';
    }));
  }

  /**
   * 加载历史趋势总览数据
   */
  public getGeneralData(): void {
    this.dataLoadingStatus.echartsData = DataStatus.LOADING;
    this.subscription.add(this._service.getGeneralData(this.modelCode, this.latestVisitData.modelVersion).subscribe(data => {
      if (data) {
        this.generalData = data;
        this.dataLoadingStatus.echartsData = DataStatus.NORMAL;
        // 默认加载本次就诊的数据
        this.visitId = this.generalData && this.generalData.button && this.generalData.button[0] && this.generalData.button[0].value;
        this.getAiHistoryDataById();
      } else {
        this.dataLoadingStatus.echartsData = DataStatus.NODATA;
        this.dataLoadingStatus.explainData = DataStatus.NODATA;
      }
    }, () => {
      this.dataLoadingStatus.echartsData = DataStatus.NODATA;
      this.dataLoadingStatus.explainData = DataStatus.NODATA;
      this.echartsErrorType = 'bar';
    }));
  }

  /**
   * 加载echarts数据
   */
  public loadEchartsData(): void {
    if (this.echartsErrorType === 'line') {
      this.getAiHistoryDataById();
    } else if (this.echartsErrorType === 'bar') {
      this.getBarEchartsData();
    }
  }

  /**
   * 事件埋点
   * @param eventCategory
   * @param eventLocation
   * @param eventName
   * @param itemName
   */
  public eventLog(eventCategory: number, eventLocation: string, eventName: string, itemName: string): void {
    this.subscription.add(
      this._cdss.operationLog({ eventCategory, eventLocation, eventName, itemName }).subscribe()
    );
  }
}
