import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { DecisionSupportItem } from '../../interface/cdss-interface';
import { DecisionSupportService } from '../decision-support.service';
import { CDSSService } from '../../cdss.service';

@Component({
  selector: 'cds-condition-analysis',
  templateUrl: './condition-analysis.component.html',
  styleUrls: ['./condition-analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionAnalysisComponent implements OnInit {

  _data: DecisionSupportItem;
  @Input('data')
  set data(data: DecisionSupportItem) {
    this._data = data;
    const newScaleInfo = {};
    const { typeLevel1 } = data;
    const scaleArr = [];
    // tslint:disable-next-line:no-unused-expression
    data.actions && data.actions.forEach(item => {
      const { typeLevel, typeContent } = item;
      typeContent.forEach(contentItem => {
        const { extFlag1, extFlag2, content } = contentItem;
        const { code, name } = content[0];

        newScaleInfo[code] = {
          typeLevel1, typeLevel3: typeLevel, type: extFlag1,
          scaleType: extFlag2, score: null, scoreUnit: '', name: `【${item.typeLevelName}】${name}`
        };

        if (extFlag1 === 'AI') {
          this._decisionSupportService.getAiScore([code]).subscribe(_data => {
            if (_data && _data.length) {
              const _Data = _data.find(d => d.code === code);
              if (_Data) {
                const { tip, modelVersion } = _Data;
                this.scaleInfo[code].score = tip;
                this.scaleInfo[code].modelVersion = modelVersion;
                this._changeDetectorRef.detectChanges();
              }
            }
          });
        } else if (extFlag1 === 'scale') {
          scaleArr.push(code);
        }
      });

    });
    this.scaleInfo = newScaleInfo;
    if (scaleArr.length > 0) {
      this._decisionSupportService.getScaleScore2(scaleArr).subscribe(_data => {
        if (Array.isArray(_data)) {
          _data.forEach(item => {
            this.scaleInfo[item.code].score = item.score;
            this.scaleInfo[item.code].scoreUnit = item.scaleUnit;
          });
          this._changeDetectorRef.detectChanges();
        }
      });
    }
  }

  public get data(): DecisionSupportItem {
    return this._data;
  }

  scaleInfo = {};

  constructor(
    private _cdssService: CDSSService,
    private _decisionSupportService: DecisionSupportService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  public getScaleScore(scale: string): string {
    const { score, scoreUnit } = this.scaleInfo[scale];
    if (score === null || score === '') {
      return '-';
    } else {
      return scoreUnit ? score + scoreUnit : score;
    }
  }

  public getScaleEvaluateType(code: string): string {
    const item = this.scaleInfo[code];
    const score = item.score;
    console.log(this.scaleInfo[code]);
    if (item.type === 'AI') {
      if (score === null || score === '') {
        return '运算中';
      } else {
        return '详情';
      }
    } else {
      if (score !== null && score !== '') {
        return '重新评估';
      } else {
        return '去评估';
      }
    }
  }

  public gotoDetails(code: string, btnName: string): void {
    const clickScale = this.scaleInfo[code];
    if (clickScale.type === 'AI') {
      const score = clickScale.score;
      if (score === null || score === '') {
        return;
      }
    }
    this._cdssService.caMore({ ...clickScale, code, btnName });
  }
}
