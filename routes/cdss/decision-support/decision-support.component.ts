import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Renderer2
} from "@angular/core";
import { CDSSService } from "../cdss.service";
import { DecisionSupportService } from "./decision-support.service";
import { Subscription } from "rxjs";
import {
  DecisionSupportItem,
  NewInfoType,
  DataStatus,
  EventCategory,
  EventLocation,
  FunctionCategory
} from "../interface/cdss-interface";
import { AuthService } from "@core/auth";
import * as _ from "lodash";
import { RelyOnEnvironmentService } from "@core/rely-on-environment/rely-on-environment.service";
import { ArkService } from "@core/ark/ark.service";

enum NewInfoDirection {
  UP = 0,
  DOWN
}

enum TabType {
  DM = "TM",
  RD = "RD",
  CA = "CA",
  CI = "CR",
  TP = "TP",
  JB = "KB"
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: "cds-decision-support",
  templateUrl: "./decision-support.component.html",
  styleUrls: ["./decision-support.component.less"]
})
export class DecisionSupportComponent implements OnInit, OnChanges, OnDestroy {
  newInfoType: NewInfoType;
  _data: DecisionSupportItem[] = [];
  set data(data: DecisionSupportItem[]) {
    // 按颜色排序
    // this._data = this.sortBasisColor(data);
    this._data = data;
    if (data) {
      this.dMData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.DM)[0]
      );
      this.rdData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.RD)[0]
      );
      this.caData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.CA)[0]
      );
      this.ciData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.CI)[0]
      );
      this.tpData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.TP)[0]
      );
      this.jbData = _.cloneDeep(
        data.filter(item => item.typeLevel1 === TabType.JB)[0]
      );
    }
  }
  isVisible: boolean = false; // 反馈弹框
  rightMenuVisible: boolean = false; // 右键按钮
  dMData: DecisionSupportItem;
  rdData: DecisionSupportItem;
  caData: DecisionSupportItem;
  ciData: DecisionSupportItem;
  tpData: DecisionSupportItem;
  jbData: DecisionSupportItem;

  subscription: Subscription;
  pageStatus: number = 0; // 0：主界面，1：诊疗监控更多
  newInfoDirection: number = NewInfoDirection.UP;
  currentTab: number = 0;
  dMonitorHistory: DecisionSupportItem[];
  dConditionAnalysisData = [];
  loadingStatus: DataStatus = DataStatus.NORMAL;
  fBcontent = ""; // 反馈内容
  fBTypeLevelName = ""; // 反馈标题
  actionId = ""; // 反馈actionId
  constructor(
    private _cdssService: CDSSService,
    public _decisionSupportService: DecisionSupportService,
    private elementRef: ElementRef,
    private _arkService: ArkService,
    private _auth: AuthService,
    private _relyOnEnvironment: RelyOnEnvironmentService,
    private _render: Renderer2
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.addSubscription();
    this.elementRef.nativeElement
      .querySelector(".decision-support")
      .addEventListener("click", this.closeRightMenu);
    this.elementRef.nativeElement
      .querySelector(".decision-support")
      .addEventListener("scroll", this.closeRightMenu);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { newInfo } = changes;
    if (newInfo && newInfo.currentValue) {
      this.setInfoDirection();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.elementRef.nativeElement
      .querySelector(".decision-support")
      .removeEventListener("click", this.closeRightMenu);
    this.elementRef.nativeElement
      .querySelector(".decision-support")
      .removeEventListener("scroll", this.closeRightMenu);
  }

  /**
   *订阅消息
   *
   * @memberof DecisionSupportComponent
   */
  public addSubscription(): void {
    this.subscription.add(
      // 推送得到新的performerId
      this._cdssService.pushPerformerId$.subscribe(() => {
        this._decisionSupportService.initData();
        this.getDecisionSupportData(true);
      })
    );
    this.subscription.add(
      this._cdssService.isDecisionSupport$.subscribe(isDS => {
        if (isDS && this.newInfoType) {
          this.setInfoDirection();
        }
      })
    );
    this.subscription.add(
      this._auth.patientSubject$.subscribe(data => {
        if (data) {
          this.pageStatus = 0;
          this._decisionSupportService.initData();
          this._cdssService.initData();
          this._cdssService.tabChangeBehaviorSubject$.next(1);
          if (!this._cdssService.connection.state) {
            this._cdssService.startConnection();
          }
        }
      })
    );
    this.subscription.add(
      this._decisionSupportService.reloadDecision$.subscribe(() => {
        this.getDecisionSupportData();
      })
    );
    this.subscription.add(
      this._auth.tokenSubject$.subscribe(_data => {
        if (this._auth.getToken()) {
          this.getDecisionSupportData();
        }
      })
    );
    this.subscription.add(
      this._decisionSupportService.modal$.subscribe(data => {
        const {
          visible,
          clientX,
          clientY,
          content,
          typeLevelName,
          actionId
        } = data;

        this.rightMenuVisible = visible;
        this.fBTypeLevelName = typeLevelName;
        this.fBcontent = content;
        this.actionId = actionId;
        const { clientHeight, clientWidth } = document.body;
        let x = clientX;
        let y = clientY;
        if (clientX + 100 > clientWidth) {
          x -= 68;
        }
        if (clientY + 40 > clientHeight) {
          y -= 38;
        }
        this._render.setStyle(
          this.elementRef.nativeElement.querySelector(".rightMenu"),
          "top",
          `${y}px`
        );
        this._render.setStyle(
          this.elementRef.nativeElement.querySelector(".rightMenu"),
          "left",
          `${x}px`
        );
      })
    );
  }

  public get hasData(): boolean {
    return !!(
      this.dMData ||
      this.rdData ||
      this.ciData ||
      this.tpData ||
      this.caData ||
      this.jbData
    );
  }

  /**
   *统一请求actions数据
   *
   * @param {boolean} [newInfo=false] 是否需要判断新消息
   * @memberof DecisionSupportComponent
   */
  public getDecisionSupportData(newInfo: boolean = false): void {
    this.loadingStatus = DataStatus.LOADING;
    const performId = this._cdssService.performerId;
    this.subscription.add(
      this._decisionSupportService
        .getDecisionSupportData({ performId })
        .subscribe(
          data => {
            try {
              // 关闭之前的禁忌弹窗
              this._arkService.closeTabooAlert();
              // 重置新消息
              this.newInfoType = NewInfoType.NoInfo;
              this._cdssService.newInfoSubject$.next({
                type: this.newInfoType,
                count: 0
              });
              const { visitNo } = data;
              // 计算action数量
              this.calculateActionCount(data.actions);
              if (visitNo !== this._auth.patient.patientMedicalRecord) {
                this.loadingStatus = DataStatus.NORMAL;
              } else {
                this._cdssService.performerId = data.performId;
                let endData = data.actions;
                if (newInfo) {
                  endData = this.hasNewInfo(this._data, data.actions);
                }
                this.data = endData;
                if (!this.hasData) {
                  this.loadingStatus = DataStatus.NODATA;
                } else {
                  this.loadingStatus = DataStatus.NORMAL;
                }
              }
            } catch (error) {
              this.loadingStatus = DataStatus.NODATA;
            }
          },
          () => {
            this.loadingStatus = DataStatus.NODATA;
          }
        )
    );
  }

  /**
   *有推送的时候，判断是否有新消息以及其类型
   *
   * @param {*} data
   * @param {*} nextData
   * @memberof CDSSComponent
   */
  public hasNewInfo(
    data: DecisionSupportItem[],
    nextData: any[] | DecisionSupportItem[]
  ): DecisionSupportItem[] {
    let typeFlag = "";
    let newInfoCount = 0;
    for (let i = 0; i < nextData.length; i++) {
      const next = _.cloneDeep(nextData[i]);
      const cur = data.find(curItem => curItem.typeLevel1 === next.typeLevel1);
      next.actions = next.actions.map(action => {
        const actionTypeLevel = action.typeLevel;
        const curAction =
          cur &&
          cur.actions &&
          cur.actions.find(_action => _action.typeLevel === actionTypeLevel);
        // 判断typeContent中的新消息
        action.typeContent = action.typeContent.map(typeItem => {
          // 有typeLevel分类，则按照类型进行判断，没有就在整个actions中判断
          typeItem.content = typeItem.content.map(_content => {
            let newInfo = true;
            if (actionTypeLevel) {
              if (curAction) {
                // tslint:disable-next-line:no-unused-expression
                curAction &&
                  curAction.typeContent.forEach(element => {
                    if (
                      element.content &&
                      element.content.find(
                        _contentItem => _contentItem.name === _content.name
                      )
                    ) {
                      newInfo = false;
                    }
                  });
              }
            } else {
              // tslint:disable-next-line:no-unused-expression
              cur &&
                cur.actions &&
                cur.actions.forEach(element => {
                  element.typeContent.forEach(curTypeContent => {
                    if (
                      curTypeContent.content &&
                      curTypeContent.content.find(
                        _contentItem => _contentItem.name === _content.name
                      )
                    ) {
                      newInfo = false;
                    }
                  });
                });
            }
            _content.isNew = newInfo;
            // tslint:disable-next-line:no-unused-expression
            newInfo && newInfoCount++;
            if (newInfo && !typeFlag) {
              typeFlag = next.typeLevel1;
            }
            return _content;
          });
          return typeItem;
        });
        // 判断children中的新消息
        action.children = action.children.map(child => {
          const childTypeLevel = child.typeLevel;
          const curChild =
            curAction &&
            curAction.children &&
            curAction.children.find(
              _child => _child.typeLevel === childTypeLevel
            );
          child.typeContent = child.typeContent.map(typeItem => {
            typeItem.content = typeItem.content.map(_content => {
              let newInfo = true;
              if (curChild) {
                // tslint:disable-next-line:no-unused-expression
                curChild.typeContent &&
                  curChild.typeContent.forEach(element => {
                    if (
                      element.content &&
                      element.content.find(
                        _contentItem => _contentItem.name === _content.name
                      )
                    ) {
                      newInfo = false;
                    }
                  });
              }
              _content.isNew = newInfo;
              // tslint:disable-next-line:no-unused-expression
              newInfo && newInfoCount++;
              if (newInfo && !typeFlag) {
                typeFlag = next.typeLevel1;
              }
              return _content;
            });
            return typeItem;
          });
          return child;
        });
        return action;
      });
      nextData[i] = next;
    }

    let newInfoType;
    switch (typeFlag) {
      case "TM":
        newInfoType = NewInfoType.DMInfo;
        break;
      case "RD":
        newInfoType = NewInfoType.RDInfo;
        break;
      case "CA":
        newInfoType = NewInfoType.IEInfo;
        break;
      case "CR":
        newInfoType = NewInfoType.CIInfo;
        break;
      case "TP":
        newInfoType = NewInfoType.TPInfo;
        break;
      case "KB":
        newInfoType = NewInfoType.JBInfo;
        break;
      default:
        newInfoType = NewInfoType.NoInfo;
    }
    this.newInfoType = newInfoType;
    this._cdssService.newInfoSubject$.next({
      type: newInfoType,
      count: newInfoCount
    });
    return nextData;
  }

  /**
   * 计算决策数
   * @param data
   */
  public calculateActionCount(data: DecisionSupportItem[]): void {
    let count = 0;
    data.forEach(next => {
      next.actions.forEach(action => {
        // 统计typeContent中的决策数
        action.typeContent.forEach(typeItem => {
          typeItem.content.forEach(_content => {
            count++;
          });
        });
        // 统计children中的决策数
        action.children.forEach(child => {
          child.typeContent.forEach(typeItem => {
            typeItem.content.forEach(_content => {
              count++;
            });
          });
        });
      });
    });
    this._decisionSupportService.actionSubject$.next(count);
  }

  /**
   *新消息的方向
   *
   * @memberof DecisionSupportComponent
   */
  public setInfoDirection(): void {
    const box = this.elementRef.nativeElement.querySelector(
      ".decision-support"
    );
    const target = this.elementRef.nativeElement.querySelector(
      this.newInfoType
    );
    if (target) {
      const { clientHeight, scrollTop } = box;
      const offsetTop = target.offsetTop;
      if (offsetTop > clientHeight + scrollTop) {
        this.newInfoDirection = NewInfoDirection.DOWN;
      } else {
        this.newInfoDirection = NewInfoDirection.UP;
      }
    }
  }

  /**
   *查看诊疗监控历史
   *
   * @memberof DecisionSupportComponent
   */
  public historyCb(): void {
    this.subscription.add(
      this._cdssService
        .operationLog({
          eventCategory: FunctionCategory.DiagnosisMonitor,
          eventLocation: EventLocation.SideBar,
          eventName: EventCategory.ToDiagnosisHistory,
          itemName: null
        })
        .subscribe()
    );
    this.pageStatus = 1;
  }

  /**
   *返回主界面
   *
   * @memberof DecisionSupportComponent
   */
  public goBack(): void {
    this.pageStatus = 0;
    if (this.newInfoType) {
      this.setInfoDirection();
    }
  }

  /**
   *定位到第一条有新消息的地方
   *
   * @memberof DecisionSupportComponent
   */
  public goNewInfo(): void {
    const target = this.elementRef.nativeElement.querySelector(
      this.newInfoType
    );
    // tslint:disable-next-line:no-unused-expression
    target && target.scrollIntoView({ behavior: "smooth" });
    this.newInfoType = NewInfoType.NoInfo;
    this._cdssService.newInfoSubject$.next({
      type: NewInfoType.NoInfo,
      count: 0
    });
  }

  /**
   *根据颜色来排序
   *
   * @param {DecisionSupportItem[]} data
   * @returns {DecisionSupportItem[]}
   * @memberof DecisionSupportComponent
   */
  public sortBasisColor(data: DecisionSupportItem[]): DecisionSupportItem[] {
    // tslint:disable-next-line:no-unused-expression
    data &&
      data.map(item => {
        item.actions = item.actions.map(action => {
          action.typeContent =
            action.typeContent &&
            action.typeContent.sort(typeItem => {
              if (typeItem.color === "red") {
                return -1;
              } else {
                return 1;
              }
            });
          action.children =
            action.children &&
            action.children.map(child => {
              child.typeContent =
                child.typeContent &&
                child.typeContent.sort(childItem => {
                  if (childItem.color === "red") {
                    return -1;
                  } else {
                    return 1;
                  }
                });
              return child;
            });
          return action;
        });

        return item;
      });
    return data;
  }
  // 关闭反馈矿
  public closeFBModal(): void {
    this.isVisible = false;
  }
  // 右键反馈
  public feedback(): void {
    this.isVisible = true;
    this.closeRightMenu();
  }
  // 关闭右键菜单
  closeRightMenu = () => {
    this.rightMenuVisible = false;
  };
}
