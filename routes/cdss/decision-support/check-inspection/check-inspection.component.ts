import { Component, Input, QueryList, ViewChildren, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NzCheckboxComponent } from 'ng-zorro-antd';
import { DecisionSupportItem, EventCategory, EventLocation, FunctionCategory } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { ArkService } from '@core/ark/ark.service';
import { CDSSService } from '../../cdss.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cds-check-inspection',
  templateUrl: './check-inspection.component.html',
  styleUrls: ['./check-inspection.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInspectionComponent implements OnDestroy {
  @Input('data') set data(data: DecisionSupportItem) {
    const { typeLevel1Name, actions } = data;
    this.typeLevel1Name = typeLevel1Name;
    this.setResultActionsData(actions);
  }
  @ViewChildren('checkbox') checkboxs: QueryList<NzCheckboxComponent>;
  resultActionsData: DecisionSupportItem['actions'];
  typeLevel1Name: string;
  subscription: Subscription = new Subscription();
  constructor(
    public decisionSupportService: DecisionSupportService,
    private _arkService: ArkService,
    private _cdssService: CDSSService
  ) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setResultActionsData (actions: DecisionSupportItem['actions']): void {
    const quotedData = this.decisionSupportService.quotedData.filter(item => item.type === 'CR')[0].data;
    if (actions) {
      // tslint:disable-next-line:no-parameter-reassignment
      actions = actions.map(item => {
        item.typeContent = item.typeContent.filter(typeContentItem => {
          if (quotedData.indexOf(typeContentItem.content[0].name) < 0) {
            return true;
          }
          return false;
        });
        return item;
      });
    }
    this.resultActionsData = actions;
  }

  public handleReference(): void {
    const arr = [];
    this.checkboxs.forEach((checkbox) => {
      const checked = checkbox.nzChecked;
      if (checked) {
        const element = checkbox.contentElement.nativeElement;
        arr.push(element.textContent);
      }
    });
    if (arr.length) {
      this._arkService.sendMessage({type: 'qouteCR', data: arr});
      // this.decisionSupportService.quoted$.next({type: 'CR', data: arr});
      // this.setResultActionsData(this.resultActionsData);
    }

    this.subscription.add(
      this._cdssService.operationLog({
        eventCategory: FunctionCategory.CheckInspection,
        eventLocation: EventLocation.SideBar,
        eventName: EventCategory.ClickQuote,
        itemName: arr.join(',')
      }).subscribe()
    );
  }
}
