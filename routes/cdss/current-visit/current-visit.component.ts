import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'emr-current-visit',
  templateUrl: './current-visit.component.html',
  styleUrls: ['./current-visit.component.less']
})
export class CurrentVisitComponent implements OnInit {
  @Input() condition = 1;
  function: string[] = [];
  radioValue: string = 'A';
 // constructor(private _patientWriterService: PatientWriterService) { }

  ngOnInit() {
    this.function = ['降压，改善心肌重构 有无高血压', '降糖 有无糖尿病', '抗凝 CHA2DS2-VASc评分判断',
     '护胃', '改善微循环', '完善相关检查：血常规，心脏超声，胸片'];
  }

  public quote(text?):void {
    const obj = {
      text: text || '患者存在心力衰竭，予以利尿药； 静息心率＜110次/分，暂不推荐心室率控制药物和节律控制药物； 患者有高血压，需要降压治疗，但哮喘病史，慎重使用β受体阻滞剂 1.抗凝 2.利尿 3.降压',
      color: '#fff9e3'
    };
  // const data = this._patientWriterService.writerDatas;
 //  data[1].texts.push(obj);
  // this._patientWriterService.writerDatas = data;
  }

}
