import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ScaleItem, HistoryTrendIten } from 'app/routes/cdss/interface/cdss-interface';
// 引入折线图
require('echarts/lib/chart/line');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入提示框和标题等组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/dataZoom');
import * as _ from 'lodash';

@Component({
  selector: 'cds-history-trend',
  templateUrl: './history-trend.component.html',
  styleUrls: ['./history-trend.component.less']
})
export class HistoryTrendComponent implements OnInit, OnChanges {
  @Input() scaleArray: ScaleItem[] = [];
  @Input() historyData: HistoryTrendIten[]; // 折线图数据
  @Input() generalData; // 总览数据(柱状图)
  @Input() dataStatus; // 数据加载状态
  @Output() selectChange: EventEmitter<any> = new EventEmitter(); // 折线图选择点变更
  @Output() visitIdChange: EventEmitter<{ visitId: string, btnName: string }> = new EventEmitter(); // 就诊id变更
  @Output() reloadData: EventEmitter<boolean> = new EventEmitter(); // 重新获取数据

  // 折线图变量
  lineChartsOption: any = {
    // 标题
    // title: {
    //   text: '历史趋势',
    //   paddingLeft: 0,
    //   textStyle: {
    //     color: '#293750',
    //     fontSize: 18,
    //     height: 28,
    //     lineHeight: 28,
    //     fontWeight: 500
    //   }
    // },
    grid: {
      left: '45px',
      right: '20px',
      bottom: '70px'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        if (params && params.length) {
          const index = params[0].dataIndex;
          const date = params[0].axisValue; // 当前坐标的x轴数据

          let str = '低危';
          str = this.getScaleName(this.historyData[index].score);

          return `日期：${date}<br/>分值：${(this.historyData[index].score * 100).toFixed(1)}分（${str}）`;
        }
      }
    },
    xAxis: {
      type: 'category',
      // 轴线设置
      axisLine: {
        lineStyle: {
          color: '#DFE2E5'
        }
      },
      // 刻度标签设置
      axisLabel: {
        textStyle: {
          color: '#92A3C1',
          fontWeight: 400,
          lineHeight: 16,
          fontSize: 10
        },
        formatter: (value) => {
          if (value) {
            const arr = value.split(' ');
            const ymd = arr[0].split('-');
            const hms = arr[1].split(':');
            return ymd[1] + '/' + ymd[2] + '\n' + hms[0] + ':' + hms[1];
          }
        }
      },
      data: []
    },
    yAxis: {
      show: true,
      type: 'value',
      min: 0,
      max: 1,
      interval: 1 / this.scaleArray.length,
      splitNumber: this.scaleArray.length,
      // 轴线设置
      axisLine: {
        show: false,
        lineStyle: {
          color: '#DFE2E5'
        }
      },
      // 分隔线
      splitLine: {
        show: true,
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#C3C9D3']
        }
      },
      // 轴刻度设置
      axisTick: {
        show: false
      },
      // 轴标签设置
      axisLabel: {
        textStyle: {
          color: '#92A3C1',
          fontWeight: 400,
          lineHeight: 17,
          fontSize: 12
        },
        formatter: (value) => {
          let texts = '';
          if (value !== 0) {
            const arr = [];
            for (let i = 0; i < this.scaleArray.length; i++) {
              arr.push((i + 1) / this.scaleArray.length);
            }
            const index = arr.findIndex(item => item >= value);
            texts = index === -1 ? '' : this.scaleArray[index].name;
          }
          return texts;
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#7ACEAB', '#B1071E'],
          opacity: 0.05
        }
      }
    },
    dataZoom: [
      {
        startValue: 0
        // endValue: 0
      },
      {
        type: 'inside'
      },
      {
        textStyle: false
      }
    ],
    series: [{
      type: 'line',
      symbol: 'emptyCircle',
      lineStyle: {
        color: '#293750'
      },
      itemStyle: {
        color: '#293750'
      },
      data: []
    }]
  };
  myChart: any;
  clickedDataIndex: number; // 记录点击过的index,阻止接口重复请求

  // 柱状图变量
  barChartsOption: any = {
    // title: {
    //   text: '历史趋势',
    //   paddingLeft: 0,
    //   textStyle: {
    //     color: '#293750',
    //     fontSize: 18,
    //     height: 28,
    //     lineHeight: 28,
    //     fontWeight: 500
    //   }
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true,        // 将 tooltip 框限制在图表的区域内
      formatter: params => {
        // 从params中取到入院时间
        const date = params[1].axisValue;
        const generalData = this.generalData.history;
        const index = generalData.findIndex(item => item.hospitalizeDate === date);
        if (index === -1) {
          return;
        }
        return `入院日期：${date ? date.split(' ')[0] : ''}<br/>
              出院日期：${generalData[index].leaveDate ? generalData[index].leaveDate.split(' ')[0] : '在院'}<br/>
              首次分：${(generalData[index].first.score * 100).toFixed(2)}分（${generalData[index].first.name}）<br/>
              末次分：${(generalData[index].last.score * 100).toFixed(2)}分（${generalData[index].last.name }）<br/>
              最大分：${(generalData[index].max.score * 100).toFixed(2)}分（${generalData[index].max.name}）<br/>
              最小分：${(generalData[index].min.score * 100).toFixed(2)}分（${generalData[index].min.name}）<br/>`;
      }
    },
    grid: {
      left: '45px',
      right: '20px',
      bottom: '70px'
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      // 轴线设置
      axisLine: {
        lineStyle: {
          color: '#DFE2E5'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#92A3C1',
          fontWeight: 400,
          lineHeight: 16,
          fontSize: 10
        },
        formatter: (value) => {
          if (value) {
            const generalData = this.generalData.history;
            const index = generalData.findIndex(item => item.hospitalizeDate === value);
            const label = index === -1 ? null :
              `${value.split(' ')[0]}\n${generalData[index].leaveDate ? generalData[index].leaveDate.split(' ')[0] : '在院'}`;
            return label;
          }
        }
      },
      data: []
    },
    yAxis: {
      show: true,
      type: 'value',
      min: 0,
      max: 1,
      interval: 1 / this.scaleArray.length,
      splitNumber: this.scaleArray.length,
      // 轴线设置
      axisLine: {
        show: false,
        lineStyle: {
          color: '#DFE2E5'
        }
      },
      // 分隔线
      splitLine: {
        show: true,
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#C3C9D3']
        }
      },
      // 轴刻度设置
      axisTick: {
        show: false
      },
      // 轴标签设置
      axisLabel: {
        textStyle: {
          color: '#92A3C1',
          fontWeight: 400,
          lineHeight: 17,
          fontSize: 12
        },
        formatter: (value) => {
          let texts = '';
          if (value !== 0) {
            const arr = [];
            for (let i = 0; i < this.scaleArray.length; i++) {
              arr.push((i + 1) / this.scaleArray.length);
            }
            const index = arr.findIndex(item => item >= value);
            texts = index === -1 ? '' : this.scaleArray[index].name;
          }
          return texts;
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#7ACEAB', '#B1071E'],
          opacity: 0.05
        }
      }
    },
    dataZoom: [
      {
        type: 'inside'
      },
      {
        textStyle: false
      }
    ],
    series: [
      {
        name: '最小分',
        type: 'bar',
        stack: '分数',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        barMaxWidth: 50,
        data: []
      },
      {
        name: '最大分',
        type: 'bar',
        stack: '分数',
        itemStyle: {
          normal: {
            color: '#54627B'
          }
        },
        barMaxWidth: 50,
        data: []
      }
    ]
  };
  barChars: any;
  height: number = document.documentElement.clientHeight / 3;

  showLineCharts: boolean = true; // 显示折线图
  activeBtn: number = 0;  // 当前点击的按钮的index值
  visitId: string;  // 上次就诊id

  public ngOnChanges(changes: SimpleChanges): void {
    const { scaleArray, historyData, generalData } = changes;

    if (historyData && historyData.currentValue && historyData.currentValue.length) {
      setTimeout(() => {
        this.initEchartsData();
      }, 100);
    }
    if (scaleArray && scaleArray.currentValue) {
      this.initEchartsScale();
    }
    if (generalData && generalData.currentValue) {
      if (generalData.currentValue.history && generalData.currentValue.history.length) {
        // 对数据按照入院时间正序排序
        this.generalData.history = _.sortBy(this.generalData.history, item => {
          return item.hospitalizeDate;
        });
        setTimeout(() => {
          this.initBarChartData();
        }, 100);
      }
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  // 初始化lineEcharts两轴数据
  public initEchartsData(): void {
    this.initLineCharts();

    if (this.historyData.length) {
      const seriesData = [];
      const xAxisData = [];
      this.historyData.forEach(item => {
        xAxisData.push(item.obsTime);
        seriesData.push(this.transformScale(item.score));
        // 初始缩放区域
        // this.lineChartsOption.dataZoom[0].startValue = this.xAxisData[0];
        // this.lineChartsOption.dataZoom[0].endValue = this.xAxisData[6];
      });
      this.lineChartsOption.series[0].data = seriesData;
      this.lineChartsOption.xAxis.data = xAxisData;
    }

    // 设置折线每个区域的线条颜色以及背景色
    switch (this.scaleArray.length) {
      case 2: {
        this.lineChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#B1071E'];
        break;
      }
      case 3: {
        this.lineChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#FFC900', '#B1071E'];
        break;
      }
      case 4: {
        this.lineChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#FFC900', '#E35E1B', '#B1071E'];
        break;
      }
    }
    this.myChart = echarts.init(document.getElementById('myChart'));
    this.myChart.setOption(this.lineChartsOption);
  }

  // 初始化barEcharts数据
  public initBarChartData(): void {
    this.initBarChart();

    if (!this.barChars) {
      return;
    }

    const seriesData = [];
    const seriesData2 = [];
    const xAxisData = [];
    this.generalData.history.forEach((item) => {
      seriesData.push(this.transformScale(item.min));
      // 防止高度为0，给定一个默认值
      seriesData2.push(this.transformScale(item.max) - this.transformScale(item.min) === 0 ? 0.01 :
        this.transformScale(item.max) - this.transformScale(item.min));
      xAxisData.push(item.hospitalizeDate);
    });
    this.barChartsOption.series[0].data = seriesData;
    this.barChartsOption.series[1].data = seriesData2;
    this.barChartsOption.xAxis.data = xAxisData;

    // 设置折线每个区域的背景色
    switch (this.scaleArray.length) {
      case 2: {
        this.barChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#B1071E'];
        break;
      }
      case 3: {
        this.barChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#FFC900', '#B1071E'];
        break;
      }
      case 4: {
        this.barChartsOption.yAxis.splitArea.areaStyle.color = ['#7ACEAB', '#FFC900', '#E35E1B', '#B1071E'];
        break;
      }
    }
    this.barChars = echarts.init(document.getElementById('barChart'));
    this.barChars.setOption(this.barChartsOption);
  }

  // 初始化y轴刻度以及label
  public initEchartsScale(): void {
    // 折线分段显示不同的颜色
    this.lineChartsOption.yAxis.interval = 1 / this.scaleArray.length;
    this.lineChartsOption.yAxis.splitNumber = this.scaleArray.length;

    this.barChartsOption.yAxis.interval = 1 / this.scaleArray.length;
    this.barChartsOption.yAxis.splitNumber = this.scaleArray.length;
  }

  /**
   * 计算某个值在经过缩放后对应的值
   * @param scale
   */
  public transformScale(scale: number): number {
    let value = 0;
    const index = this.scaleArray.findIndex(item => item.scale >= scale);  // 处于scaleArray的index
    const perPartWidth = 1 / this.scaleArray.length;  // 等比例缩放每个区域的比例
    let percent = 0; // 在某个区域百分比位置，ex: 20% 处于30%和40%这个区间的50%位置
    if (index !== -1) {
      percent = index === 0 ? 0 : (scale - this.scaleArray[index - 1].scale) /
        (this.scaleArray[index].scale - this.scaleArray[index - 1].scale);

  public value = perPartWidth * index + (index === 0 ? (scale / this.scaleArray[0].scale * perPartWidth) :
        ((percent === 0 ? 1 : percent) * perPartWidth));
    }
    return value;
  }

  // 初始化折线图
  public initLineCharts(): void {
    const dom = document.getElementById('myChart');
    if (!dom) {
      return;
    }
    this.myChart = echarts.init(dom);
    this.myChart.setOption(this.lineChartsOption);

    // 监听点击事件
    this.myChart.getZr().on('click', params => {
      const pointInPixel = [params.offsetX, params.offsetY];
      if (this.myChart.containPixel('grid', pointInPixel)) {
        const xIndex = this.myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
        if (xIndex !== this.clickedDataIndex) {
          this.clickedDataIndex = xIndex;
          this.selectChange.emit({
            score: this.historyData[xIndex].score,
            obsTime: this.historyData[xIndex].obsTime,
            modelVersion: this.historyData[xIndex].modelVersion
          });
        }
      }
    });

    // 更新位置
    this.myChart.on('dataZoom', () => {
      this.myChart.setOption({
        graphic: echarts.util.map(this.lineChartsOption.series[0].data, (item, dataIndex) => {
          return {
            position: this.myChart.convertToPixel('grid', item)
          };
        })
      });
    });

    window.onresize = () => {
      this.height = document.documentElement.clientHeight / 3;
      this.myChart.resize({ height: this.height });
    };
  }

  // 初始化柱状图
  public initBarChart(): void {
    const dom = document.getElementById('barChart');
    if (!dom) {
      return;
    }
    this.barChars = echarts.init(dom);
    this.barChars.setOption(this.barChartsOption);

    this.barChars.getZr().on('click', params => {
      const pointInPixel = [params.offsetX, params.offsetY];
      if (this.barChars.containPixel('grid', pointInPixel)) {
        const xIndex = this.barChars.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
        const visitId = this.generalData.history[xIndex].visitId; // 当前点击数据的visitId
        const index = this.generalData && this.generalData.button && this.generalData.button.findIndex(item => item.value === visitId);
        if (index > -1) {
          this.activeBtn = index;
        } else {
          this.activeBtn = 0;
          this.generalData.button.unshift({
            name: this.generalData.history[xIndex].hospitalizeDate.split(' ')[0],
            value: visitId
          });
        }
        this.visitId = visitId;
        this.showLineCharts = true;
        this.visitIdChange.emit({ visitId, btnName: '' });
      }
    });

    window.onresize = () => {
      this.height = document.documentElement.clientHeight / 3;
      this.barChars.resize({ height: this.height });
    };
  }

  // 处理按钮点击
  public handleBtnClick(btn: { name: string, value: string }, index: number): void {
    this.showLineCharts = btn.value !== 'zl';
    // 点击总览按钮则把新增的按钮清除掉
    if (this.showLineCharts && index === 3) {
      this.generalData.button.shift();
      this.activeBtn = 2;
    } else {
      this.activeBtn = index;
    }
    this.clickedDataIndex = null;
    const visitId = this.generalData.button[this.activeBtn].value;
    if (this.visitId !== visitId) {
      this.visitId = visitId;
      this.visitIdChange.emit({ visitId, btnName: btn.name });
    }
  }

  /**
   * 获取某个分数对应的区间名
   * @param score
   */
  public getScaleName(score: number): string {
    if (score || score === 0) {
      const i = this.scaleArray.findIndex(item => item.scale >= score);
      return this.scaleArray[i].name;
    }
  }

  /**
   * 刷新数据
   */
  public refresh(): void {
    this.reloadData.emit(true);
  }
}
