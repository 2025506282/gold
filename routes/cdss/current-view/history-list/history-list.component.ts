import { Component, OnInit, Input } from '@angular/core';
import { CDSSService } from '../../cdss.service';

@Component({
  selector: 'cds-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.less']
})
export class HistoryListComponent implements OnInit {
  isExpand: boolean = true;
  constructor(private _cdssService: CDSSService) { }
  @Input() list: any[];
  @Input() type: any;
  ngOnInit(): void {
  }
  public toggle(): void {
    this.isExpand = !this.isExpand;
  }
  // 点击详情或重新评估
  public toDetail(item: any): void {
    this._cdssService.performerId = item.performerId;
    const model = {
      name: item.name,
      code: item.code,
      scaleType: this.type || item.scoreType,
      type: this.type,
      btnName: this.type === 'AI' ? '重新评估' : '详情',
      modelVersion: this.type === 'AI' ? item.modelVersion : ''
    };
    this._cdssService.caMore(model);
  }
}
