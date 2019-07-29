import {
  Component,
  Input,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { NzCheckboxComponent } from 'ng-zorro-antd';
import { DecisionSupportItem, EventCategory, EventLocation, FunctionCategory } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { ArkService } from '@core/ark/ark.service';
import { CDSSService } from '../../cdss.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cds-treatment-plan',
  templateUrl: './treatment-plan.component.html',
  styleUrls: ['./treatment-plan.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentPlanComponent implements OnDestroy {
  @Input('data') set data(data: DecisionSupportItem) {
    const { actions, typeLevel1Name } = data;
    this.typeLevel1Name = typeLevel1Name;
    this.setResultActionsData(actions);
  }
  @ViewChildren('MACheckbox') ma: QueryList<NzCheckboxComponent>;
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

  /**
   *设置resultActionsData
   *
   * @param {*} actions
   * @memberof TreatmentPlanComponent
   */
  public setResultActionsData(actions: any): void {
    const quotedData = this.decisionSupportService.quotedData.filter(item => item.type === 'TP')[0].data;

    if (actions) {
      // tslint:disable-next-line:no-parameter-reassignment
      actions = actions.map(item => {
        if (item.typeLevel === 'TP-MA') {
          item.children.map(child => {
            child.typeContent = child.typeContent.map(typeItem => {
              const endData = [];
              typeItem.content.forEach(contentItem => {
                const index = quotedData.indexOf(contentItem.name);
                if (index === -1) {
                  endData.push({...contentItem});
                }
              });
              typeItem.content = endData;
              return typeItem;
            })
              .filter(typeItem => typeItem.content.length > 0);
            return child;
          });
        }
        return item;
      });
    }
    this.resultActionsData = actions;
  }
  public handleMAReference(): void {
    const arr = [];
    this.ma.forEach((checkbox) => {
      const checked = checkbox.nzChecked;
      if (checked) {
        const element = checkbox.contentElement.nativeElement;
        arr.push(element.textContent);
      }
    });

    if (arr.length > 0) {
      this._arkService.sendMessage({type: 'qouteTP', data: arr});
      // this.decisionSupportService.quoted$.next({type: 'TP', data: arr});
      // this.setResultActionsData(this.resultActionsData);
    }

    this.subscription.add(
      this._cdssService.operationLog({
        eventCategory: FunctionCategory.TreatmentPlan,
        eventLocation: EventLocation.SideBar,
        eventName: EventCategory.ClickQuote,
        itemName: arr.join(',')
      }).subscribe()
    );
  }
}
