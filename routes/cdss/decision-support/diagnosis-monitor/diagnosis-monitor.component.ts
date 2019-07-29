import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DecisionSupportItem } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';

@Component({
  selector: 'cds-diagnosis-monitor',
  templateUrl: './diagnosis-monitor.component.html',
  styleUrls: ['./diagnosis-monitor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagnosisMonitorComponent implements OnInit {
  constructor(
    private _decisionSupportService: DecisionSupportService
  ) { }

  @Input('data') set data(data: DecisionSupportItem) {
    const { actions = [] } = data;
    let popUpData;

    // tslint:disable-next-line:one-variable-per-declaration
    const hasCollapseActions = [], noCollapseActioins = [];
    actions.forEach(action => {
      if (this.noCollapseArr.indexOf(action.typeLevel) > -1) {
        noCollapseActioins.push(action);
      } else {
        hasCollapseActions.push(action);
      }

      // 查找出第一个禁忌弹框
      if (!popUpData && action.typeContent) {
        const popUpAction = action.typeContent.find(contentItem => contentItem.displayType === 'elastic_frame');
        if (popUpAction) {
          popUpData = {
            title: action.typeLevelName,
            content: popUpAction.content[0].name,
            actionId: popUpAction.actionId
          };
        }
      }
    });
    data.actions = [...noCollapseActioins, ...hasCollapseActions];
    this._data = data;
    if (popUpData) {
      this._decisionSupportService.popUpData = popUpData;
    }
  }
  public get data(): DecisionSupportItem {
    return this._data;
  }

  _data: DecisionSupportItem;

  noCollapseArr = ['TM-UN', 'TM-AV', 'TM-CR'];  // 不需要折叠的项
  @Output() historyCb: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
  }

  public viewHistory(): void {
    this.historyCb.emit();
  }

}
