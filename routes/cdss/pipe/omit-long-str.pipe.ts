import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'omitLongStr'
})
export class OmitLongStrPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      const length = value.length;
      let result = '';
      if (length > 3) {
        result = value.slice(0, 3) + '..';
        return result;
      } else {
        return value;
      }
    }
  }
}
