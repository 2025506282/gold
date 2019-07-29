import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTime'
})
export class TransformTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      // tslint:disable-next-line:no-parameter-reassignment
      value = value.replace(/[\.,-]/g, '/');
      const date = new Date(value);
      const month = date.getMonth() + 1; // 获取系统月份，由于月份是从0开始计算，所以要加1
      const day = date.getDate();
      const hour = date.getHours(); // 获取系统时间
      const minute = date.getMinutes(); // 分
      return (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + ' ' +
        (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute);
    } else {
      return '';
    }

  }

}
