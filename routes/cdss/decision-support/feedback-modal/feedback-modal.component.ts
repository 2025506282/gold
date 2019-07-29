import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DecisionSupportService } from '../decision-support.service';
import { delay } from 'lodash';

enum Status {
  feedback,
  success
}
@Component({
  selector: 'cds-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.less'],
})
export class FeedbackModalComponent implements OnInit {
  _visible = false;
  @Input()
  set visible(visible: boolean) {
    if (visible) {
      this.initData();
    }
    this._visible = visible;
  }
  public get visible(): boolean {
    return this._visible;
  }
  @Input() content = '';
  @Input() typeLevelName = '';
  @Input() actionId = '';
  @Output() closeCb: EventEmitter<any> = new EventEmitter();
  inputValue = '';
  chooseKey: number = null;
  status = Status.feedback;
  disabledSubmit = false;  // 禁用提交按钮
  advises = [
    {
      key: 1,
      content: '对诊疗有帮助',
    },
    {
      key: 2,
      content: '对诊疗无帮助',
    },
    {
      key: 3,
      content: '推荐时机错误',
    },
    {
      key: 4,
      content: '推荐内容错误',
    },
  ];

  constructor(
    private _decision: DecisionSupportService
  ) {}

  ngOnInit(): void {}

  public handleCancel(): void {
    this.visible = false;
    this.closeCb.emit(false);
  }
  // 提交
  public submit(): void {
    this.disabledSubmit = true;
    const chooseAdvise = this.advises.find(item => item.key === this.chooseKey);
    this._decision.feedback(this.actionId, chooseAdvise ? chooseAdvise.content : '', this.inputValue.trim()).subscribe(() => {
      this.status = Status.success;
      delay(() => {
        this.handleCancel();
      }, 1000);
    });
  }

  public chooseItem(item: any): void {
    this.chooseKey = item.key;
  }
  // 检查字数
  public inputChange(value: string): void {
    if (value.length > 100) {
      setTimeout(() => {
        this.inputValue = value.substring(0, 100);
      }, 0);
    }
  }
  // 初始化状态
  public initData(): void {
    this.chooseKey = null;
    this.inputValue = '';
    this.status = Status.feedback;
    this.disabledSubmit = false;
  }

  // 判断禁用提交按钮
  public get btnDisabled(): boolean {
    const valueLen = this.inputValue.replace(/\s+/g, '').length;
    return ((valueLen || this.chooseKey) && !this.disabledSubmit) ? null : true;
  }
}
