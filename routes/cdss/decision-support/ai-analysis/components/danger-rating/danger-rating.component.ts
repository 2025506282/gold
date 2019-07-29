import { Component, Input, OnInit, SimpleChanges, ViewChild, OnChanges, ElementRef } from '@angular/core';
import { ScaleItem } from '../../../../interface/cdss-interface';
import { toPercent } from '@shared/utils/parseNum.util';

@Component({
  selector: 'cds-danger-rating',
  templateUrl: './danger-rating.component.html',
  styleUrls: ['./danger-rating.component.less']
})
export class DangerRatingComponent implements OnInit, OnChanges {
  @ViewChild('ratingBox') ratingBox: ElementRef;
  @ViewChild('ratingNum') ratingNum: ElementRef;
  @ViewChild('scaleItemBox') scaleItemBox: ElementRef;

  @Input() scale: number;
  @Input() scaleArray: ScaleItem[];
  spaceArr = new Array(35); // 划分渐变底色的间隔数量
  splitLines: number[] = [];  // 分割线数量

  constructor(
    private elementRef: ElementRef
  ) {
  }

  public ngOnChanges(change: SimpleChanges): void {
    const { scaleArray, scale } = change;
    if (scaleArray && scaleArray.currentValue) {
      this.splitLines = new Array(this.scaleArray.length + 1);

      // 延时执行，等待splitLines ngfor指令渲染完成
      setTimeout(() => {
        this.initScaleLinePos();
      });

      this.initCurRatingPos();
    }

    if (scale && scale.currentValue !== 0) {
      this.initCurRatingPos();
    }
  }

  ngOnInit(): void {
  }

  // 初始化分割线的位置
  public initScaleLinePos(): void {
    this.scaleItemBox.nativeElement.style.justifyContent = 'space-between';

    const splitLines = this.elementRef.nativeElement.querySelectorAll('.split-box>.split-line');  // 分割线
    const splitNames = this.elementRef.nativeElement.querySelectorAll('.scale-name>.split-name'); // 分割名称: 低危、高危

    const len = splitLines.length;
    // 设置分割线以及对应的label的颜色
    switch (len) {
      case 3: {
        splitLines[0].style.left = '-3px';
        splitLines[1].style.left = '50%';
        splitLines[2].style.right = '-3px';

        splitNames[1].style.color = '#FF5362';
        break;
      }
      case 4: {
        splitLines[0].style.left = '-3px';
        splitLines[1].style.left = '33.3%';
        splitLines[2].style.left = '66.7%';
        splitLines[3].style.right = '-3px';

        splitNames[1].style.color = '#FD8701';
        splitNames[2].style.color = '#FF5362';
        break;
      }
      case 5: {
        splitLines[0].style.left = '-3px';
        splitLines[1].style.left = '24.5%';
        splitLines[2].style.left = '50%';
        splitLines[3].style.left = '75%';
        splitLines[4].style.right = '-3px';

        splitNames[1].style.color = '#FD8701';
        splitNames[2].style.color = '#FF5362';
        splitNames[3].style.color = '#8E0016';
        break;
      }
      default:
        break;
    }
  }

  // 初始化当前危险比率的位置
  public initCurRatingPos(): void {
    if (this.scaleArray) {
      let ratingBoxLeft = 0;    // 盒子的left值
      const index = this.scaleArray.findIndex(item => item.scale >= this.scale);  // 处于某个区域的index
      const perPartWidth = 1 / this.scaleArray.length;  // 每个区域的比例
      let percent = 0; // 危险值在某个区域所处的位置，ex: 20% 处于30%和40%这个区间的50%位置
      if (index !== -1) {
        percent = index === 0 ? 0 : (this.scale - this.scaleArray[index - 1].scale) /
          (this.scaleArray[index].scale - this.scaleArray[index - 1].scale);
        ratingBoxLeft = perPartWidth * index +
  public (index === 0 ? (this.scale / this.scaleArray[0].scale * perPartWidth) : ((percent === 0 ? 1 : percent) * perPartWidth));
      }
      this.ratingBox.nativeElement.style.left = toPercent(ratingBoxLeft);

      // 根据ratingBoxLeft控制百分比数字向左或者向右偏移
      if (ratingBoxLeft >= 0.2 && ratingBoxLeft < 0.8) {
        this.ratingNum.nativeElement.style.marginLeft = 0;
      } else if (ratingBoxLeft >= 0.8 && ratingBoxLeft <= 1) {
        this.ratingNum.nativeElement.style.marginLeft = '-20px';
      }
    }
  }
}
