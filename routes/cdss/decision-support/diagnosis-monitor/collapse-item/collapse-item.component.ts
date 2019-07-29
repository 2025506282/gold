import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActionItem } from 'app/routes/cdss/interface/cdss-interface';

@Component({
  selector: 'cds-collapse-item',
  templateUrl: './collapse-item.component.html',
  styleUrls: ['./collapse-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapseItemComponent implements OnInit {

  @Input() data: ActionItem;
  @Input() hasCollapse = false;   // 是否有折叠功能
  collapse = false;      // 折叠的状态
  constructor() { }

  ngOnInit(): void {
  }

  public toggleCollapse(): void {
    this.collapse = !this.collapse;
  }
}
