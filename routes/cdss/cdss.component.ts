import { Component, OnInit, OnDestroy } from '@angular/core';
import { CDSSService } from './cdss.service';
import { Subscription } from 'rxjs';
import { DecisionSupportItem } from './interface/cdss-interface';
import { AuthService } from '@core/auth';
import { ArkService } from '@core/ark/ark.service';

@Component({
  selector: 'cds-cdss',
  templateUrl: './cdss.component.html',
  styleUrls: ['./cdss.component.less'],
})
export class CDSSComponent implements OnInit, OnDestroy {
  currentTab: number; // 当前tab
  tabs = [];
  subscription: Subscription;     // 添加订阅事件对象
  decisionSupportData: DecisionSupportItem[];    // 辅助决策的数据
  hadRegister: boolean = false;
  constructor(
    private _cdssService: CDSSService,
    private _arkService: ArkService,
    private _auth: AuthService,
  ) {
    this.subscription = new Subscription();
    this.currentTab = 0;
  }

  ngOnInit(): void {
    this.tabs = [
      // tabs的数据
      // {
      //   title: '病史信息',
      //   key: 0,
      // },
      {
        title: '辅助决策',
        key: 1,
      },
      // , {
      //   title: '临床路径',
      //   key: 2,
      // },
      {
        title: '本次就诊',
        key: 3,
      }
    ];
    this.initCdss().then(() => {
      if (this._arkService.isBrowser) {
        this.subscription.add(
          this._arkService.loadBridgeScript().subscribe(data => {
            if (data) {
              this._arkService.cdsInited({ init: true });
            }
          })
        );
      } else {
        this._arkService.cdsInited({init: true});
      }
    });
    this.addSubscription();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._cdssService.initData();
    if (this._auth.getToken()) {
      this._cdssService.exitService().subscribe(data => {
        // alert(data)
      });
    }
    this._auth.clearToken();
  }

  /**
   *添加订阅事件
   *
   * @memberof PatientCdssComponent
   */
  public addSubscription(): void {
    this.subscription.add(
      this._cdssService.tabChangeBehaviorSubject$.subscribe(key => {
        const index = this.tabs.findIndex(item => item.key === key) || 0;
        this.currentTab = index;
      }),
    );
    this.subscription.add(
      this._auth.tokenSubject$.subscribe(hasToken => {
        if (this._auth.getToken()) {
          this.hadRegister = true;
        }
      })
    );
  }

  /**
   *初始化CDSS
   *
   * @returns {Promise<any>}
   * @memberof CDSSComponent
   */
  public initCdss(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 建立通讯
      this._cdssService.establishConnection();
      this.onEmrMessage();
      resolve();
    });
  }

  /**
   *接受EMR辅助决策消息
   *
   * @memberof CDSSComponent
   */
  public onEmrMessage(): void {
    this.subscription.add(this._arkService.decisionSupporting$.subscribe(value => {
      const params = {
        jsonData: JSON.stringify(value.jsonData),
      };
      this._cdssService.assistantDecision(params).subscribe(res => {
        // alert('收到医嘱，已发送到cdss' + JSON.stringify(data))
      });
    }));
  }

  /**
   *切换tab的回调
   *
   * @param {number} index
   * @memberof CDSSComponent
   */
  public tabChange(index: number): void {
    this.currentTab = index;
    const key = this.tabs[index].key;
    this._cdssService.tabChangeBehaviorSubject$.next(key);
    if (key === 1) {
      this._cdssService.isDecisionSupport$.next(true);
    }
  }
}
