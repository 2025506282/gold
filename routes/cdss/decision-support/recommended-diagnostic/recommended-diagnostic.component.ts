import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  DecisionSupportItem,
  ActionItem,
  FunctionCategory,
  EventLocation,
  EventCategory
} from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { ArkService } from '@core/ark/ark.service';
import { Subscription } from 'rxjs';
import { CDSSService } from '../../cdss.service';

@Component({
  selector: 'cds-recommended-diagnostic',
  templateUrl: './recommended-diagnostic.component.html',
  styleUrls: ['./recommended-diagnostic.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedDiagnosticComponent implements OnInit, OnDestroy {

  @Input('data') set data(data: DecisionSupportItem) {
    const { actions, typeLevel1Name } = data;
    this.typeLevel1Name = typeLevel1Name;
    this.setResultActionsData(actions[0]);
  }
  @Input() defaultShowCount: number = 5;
  @Output() quoteCb: EventEmitter<any> = new EventEmitter();
  collapse: boolean = false;
  resultActionsData: ActionItem;
  typeLevel1Name: string;
  subscription: Subscription = new Subscription();

  constructor(
    public decisionSupportService: DecisionSupportService,
    private _arkService: ArkService,
    private _cdssService: CDSSService
  ) {}
  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setResultActionsData(actionsItem: ActionItem): void {
    const quotedData = this.decisionSupportService.quotedData.filter(item => item.type === 'RD')[0].data;
    const endActionItems = actionsItem;
    if (endActionItems) {
      endActionItems.typeContent = endActionItems.typeContent.filter(item => {
        if (quotedData.indexOf(item.content[0].name) < 0) {
          return true;
        }
        return false;
      });
    }
    this.resultActionsData = endActionItems;
  }

  public get getShowData(): any {
    if (!this.resultActionsData) {
      return [];
    }
    return (this.collapse ? this.resultActionsData.typeContent : this.resultActionsData.typeContent.slice(0, this.defaultShowCount));
  }

  public quote(item: any): void {
    this._arkService.sendMessage({type: 'qouteRD', data: [item]});
    // this.decisionSupportService.quoted$.next({type: 'RD', data: item});
    // this.setResultActionsData(this.resultActionsData);

    this.subscription.add(
      this._cdssService.operationLog({
        eventCategory: FunctionCategory.RecommendedDiagnostic,
        eventLocation: EventLocation.SideBar,
        eventName: EventCategory.ClickQuote,
        itemName: item
      }).subscribe()
    );
  }

  public collapseFunc(collapse: boolean): void {
    this.collapse = collapse;
  }
}
