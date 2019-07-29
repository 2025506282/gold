import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MedicalHistory } from '../interface/cdss-interface';
import { CDSSService } from '../cdss.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'emr-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalHistoryComponent implements OnInit, OnDestroy {

  data: MedicalHistory;
  diagnosisIndex = 0;    //记录诊断的显示的第一个index
  turnCount: number = 2;  //每次切换的条数
  subscription: Subscription = new Subscription();
  constructor(private _cdssService: CDSSService,private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.addSubscription();
    
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public addSubscription(): void {
    this.subscription.add(this._cdssService.tabChangeBehaviorSubject$.subscribe(index => {
      if(index === 0) {
        // this._cdssService.loading = true;
        this._cdssService.getMedicalHistory({}).subscribe(data => {
          // this._cdssService.loading = false;
          this.data = data;
          this._changeDetectorRef.detectChanges();
        });
      }
    }))
  }

  get diagnosisIndexItem() {
    return this.data.medicalRecordItems[this.diagnosisIndex];
  }
  get nextItem() {
    return this.data.medicalRecordItems[this.diagnosisIndex + 1];
  }
  get typeDatas() {
    let typeSet = new Set();
    let typeArr = [];

    this.diagnosisIndexItem && this.diagnosisIndexItem.domainInfoItems.forEach(item => {
      typeSet.add(item.domainName);
      let obj = {
        type: item.domainName,
        current: item.variableInfoItems || [],
        next: []
      };
      typeArr.push(obj);
    });
    this.nextItem && this.nextItem.domainInfoItems.forEach(item => {
      if(typeSet.has(item.domainName)){
        typeArr = typeArr.map(typeItem => {
          if(typeItem.type === item.domainName) {
            typeItem.next = item.variableInfoItems || [];
          }
          return typeItem;
        })
      }else {
        let obj = {
          type: item.domainName,
          current: [],
          next: item.variableInfoItems || []
        };
        typeArr.push(obj);
      }
    });
    return typeArr;
   
  }

  public historyDiagnosis(flag: string): void {
    let endIndex = this.diagnosisIndex;
    if(flag === 'pre') {
      const index = this.diagnosisIndex - this.turnCount;
      if(index >= 0) {
        endIndex = index;
      }
    }else if (flag === 'next') {
      const index = this.diagnosisIndex + this.turnCount;
      if(index <= this.data.medicalRecordItems.length) {
        endIndex = index;
      }
    }
    this.diagnosisIndex = endIndex;
  }
}
