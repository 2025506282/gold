import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'emr-clinical-pathway',
  templateUrl: './clinical-pathway.component.html',
  styleUrls: ['./clinical-pathway.less']
})
export class ClinicalPathwayComponent implements OnInit {

  moreView = false;    //标志进入路径界面
  data = [];
  moreData = {
    title: '',
    list: []
  };     //路径中的数据
  lineTimeData = [];     //路径中的时间轴数据
  
  currentTime = 0;
  constructor() { }

  ngOnInit() {
    this.data = [
      {
        title: '射频消融术',
        children: [
          {
            subTitle: '入径标准',
            items: [
              '症状反复发作的阵发性房颤',
              '至少一种AAD无效或不能耐受，有症状的持续性房颤',
            ]
          },{
            subTitle: '出径标准',
            items: [
              '绝对禁忌证：左心房血栓',
              '相对禁忌证：出血性疾病活动期，穿刺部位或全身感染，脏器功能衰竭，慢性消耗性疾病晚期 ',
              '其他影响路径流程的并发症'
            ]
          }
        ]
      },{
        title: '左心耳封堵术',
        children: [
          {
            subTitle: '入径标准',
            items: [
              'CHADS-VASC评分大于等于2的非瓣膜性房颤患者',
              '不适合长期规范抗凝治疗，长期规范抗凝治疗的基础上任发生脑卒中或者栓塞时间',
              'HAS-BLED大于等于3分'
            ]
          },{
            subTitle: '出径标准',
            items: [
              '经食道超声发现心内血栓，左房/左心耳发现浓密自发显影',
              '需择期心外科手术'
            ]
          }
        ]
      }
    ]
    this.lineTimeData = [
      '第一天',
      '第二天',
      '第三天',
      '第四天',
      '第五天',
      '第六天',
      '第七天',
    ];
    this.moreData.list = [
      {
        title: '',
        children: [
          {
            text: '详细询问病史',
            status: '必选'
          },{
            text: '向家属交代可能的风险，所需诊治方案，并获得家属的知情同意签字',
            status: '必选'
          }
        ]
      },{
        title: '临时医嘱',
        children: [
          {
            text: '全血细胞学计数+五分类 ',
            status: '必选'
          },{
            text: '尿沉渣镜检+定量+尿液分析',
            status: '必选'
          },{
            text: '大便常规+隐血试验',
            status: '必选'
          },{
            text: '肝功能 10 项',
            status: '必选'
          },{
            text: '肾功能 3 项',
            status: '必选'
          },{
            text: '血电解质 4 项',
            status: '必选'
          },{
            text: '甲状腺功能 4 项',
            status: '必选'
          },{
            text: '心脏彩超',
            status: '必选'
          }
        ]
      },{
        title: '长期医嘱',
        children: [
          {
            text: '抗心律失常药物',
            status: '必选'
          },{
            text: 'PPI 制剂',
            status: '必选'
          },{
            text: '达比加群',
            status: '必选'
          }
        ]
      }
    ]
  }


  /**
   *切换tab
   *
   * @param {*} [tab=-1]
   * @memberof ClinicalPathwayComponent
   */
  public toggleMoreView(tab = -1):void {
    if(tab >= 0) {
      this.moreData.title = this.data[tab].title;
    }
    this.moreView = !this.moreView;
  }
}
