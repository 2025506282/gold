import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "toPercent" })
export class ToPercentPipe implements PipeTransform {
  transform(value: any, ...args): string {
    if (value || value === 0) {
      let percent = Number(value * 100).toFixed(1);
      percent += "%";
      return percent;
    }
  }
}
