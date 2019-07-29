import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DecisionSupportItem, EventCategory, EventLocation, FunctionCategory } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { Subscription } from 'rxjs';
import { CDSSService } from '../../cdss.service';

@Component({
  selector: 'cds-disease-knowledge',
  templateUrl: './disease-knowledge.component.html',
  styleUrls: ['./disease-knowledge.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiseaseKnowledgeComponent implements OnInit, OnDestroy {
  @Input() data: DecisionSupportItem;
  subscription: Subscription = new Subscription();

  constructor(
    private _decisionSupportService: DecisionSupportService,
    private _cdssService: CDSSService
  ) {
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public detail(data: any): void {
    this.subscription.add(
      this._cdssService.operationLog({
        eventCategory: FunctionCategory.DiseaseKnowledge,
        eventLocation: EventLocation.SideBar,
        eventName: EventCategory.ToDetail,
        itemName: data.content[0].name
      }).subscribe()
    );

    this._decisionSupportService.openDocument(data);
  }

}
