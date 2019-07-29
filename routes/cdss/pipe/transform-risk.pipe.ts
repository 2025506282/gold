import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'transformRisk'
})

export class TransformRiskPipe implements PipeTransform {
  id: number;
  gender: string;

  transform(value: any, ...args): any {

    let color = '#293750';
    let endText = '';
    const type = args[0];
    let gender = '男';
    if (args[1]) {
      gender = args[1].gender || '男';
    }

    if (type === 'CHA2DS2-VASC') {
      if (gender === '男') {
        switch (+value) {
          case 0:
            endText = value + '分(低危)';
            break;
          case 1:
            endText = value + '分(中危)';
            color = '#FF9A4A';
            break;
          default:
            endText = value + '分(高危)';
            color = '#FF4454';
            break;
        }
      }else if(gender === '女') {
        switch (+value - 1) {
          case -1:
          case 0:
            endText = value + '分(低危)';
            break;
          case 1:
            endText = value + '分(中危)';
            color = '#FF9A4A';
            break;
          default:
            endText = value + '分(高危)';
            color = '#FF4454';
            break;
        }
      }
    }else if(type === 'HAS-BLED') {
      if(+value < 3) {
        endText = value + '分(低危)';
      }else {
        endText = value + '分(高危)';
        color = '#FF4454';
      }
    }
    else if(type === 'AI') {
      if(+value === 100) {
        endText = '高危';
        color = '#FF4454';
      }
    }

    return `<span style="color:${color}">${endText}</span>`;
  }

}
