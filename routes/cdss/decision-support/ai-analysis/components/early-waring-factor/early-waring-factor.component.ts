import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BasisItem } from '../../../../interface/cdss-interface';
import { toPercent } from '@shared/utils/parseNum.util';

@Component({
  selector: 'cds-early-waring-factor',
  templateUrl: './early-waring-factor.component.html',
  styleUrls: ['./early-waring-factor.component.less']
})
export class EarlyWaringFactorComponent implements OnInit, OnChanges {
  @Input() 'basis': BasisItem[];

  constructor(private elementRef: ElementRef) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { basis } = changes;
    if (basis && basis.currentValue && basis.currentValue.length) {
      setTimeout(() => {
        this.initUnderLineWidth();
      });
    }
  }

  ngOnInit(): void {
  }

  // 初始化预警依据影响因素下划线宽度
  public initUnderLineWidth(): void {
    const underLines: any = this.elementRef.nativeElement.querySelectorAll('.factor-content>.underline');
    const baseWidth = this.basis[0].weight;

    this.basis.forEach((item, index) => {
      if (index > 0) {
        if (item.weight) {
          underLines[index].style.width = toPercent(Math.abs(item.weight / baseWidth));
        } else {
          underLines[index].style.width = 0;
        }
      }
    });
  }
}
