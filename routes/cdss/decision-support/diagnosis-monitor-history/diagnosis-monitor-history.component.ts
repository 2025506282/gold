import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStatus } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cds-diagnosis-monitor-history',
  templateUrl: './diagnosis-monitor-history.component.html',
  styleUrls: ['./diagnosis-monitor-history.component.less'],
})
export class DiagnosisMonitorHistoryComponent implements OnInit, OnDestroy {

  data = [];
  loadingStatus: DataStatus;
  subscription: Subscription = new Subscription();
  constructor(
    private _decisionSupportService: DecisionSupportService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  public ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
  /**
   *获取数据
   *
   * @memberof DiagnosisMonitorHistoryComponent
   */
  public getData(): void {
    this.loadingStatus = DataStatus.LOADING;
    this.subscription = this._decisionSupportService.getDiagnosisMonitorHistory({ TypeLevel1: 'TM' }).subscribe(data => {
      this.data = data;
      if (data && data.length > 0) {
        this.loadingStatus = DataStatus.NORMAL;
      } else {
        this.loadingStatus = DataStatus.NODATA;
      }
    }, () => {
      this.loadingStatus = DataStatus.NODATA;
    });
  }
}
