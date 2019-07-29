import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformUnderline'
})
export class TransformUnderlinePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    return value.replace(/_/g, '<span>_</span>');
  }
}
