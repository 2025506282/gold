import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tpItemLenFilter',
  pure: false
})
export class TpItemLenFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let len = 0;
    value.typeContent && value.typeContent.forEach(typeContent => {
      len += typeContent.content.length;
    });
    value.length = len;
    return value;
  }

}
