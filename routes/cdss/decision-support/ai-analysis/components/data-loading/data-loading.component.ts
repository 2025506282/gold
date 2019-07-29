import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataLoadingStatusComponent } from '@shared/components/data-loading-status/data-loading-status.component';

@Component({
  selector: 'cds-data-loading',
  templateUrl: './data-loading.component.html',
  styleUrls: ['./data-loading.component.less']
})
export class DataLoadingComponent extends DataLoadingStatusComponent implements OnInit {
  @Output() getLatestResult: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  public toLatestResult(): void {
    this.getLatestResult.emit(true);
  }
}
