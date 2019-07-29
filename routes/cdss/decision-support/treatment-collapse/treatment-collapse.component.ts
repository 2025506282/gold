import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cds-treatment-collapse',
  templateUrl: './treatment-collapse.component.html',
  styleUrls: ['./treatment-collapse.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentCollapseComponent implements OnInit {

  @Input() data;
  @Input() itemName;
  collapse: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  public toggleCollapse(): void {
    this.collapse = !this.collapse;
  }
}
