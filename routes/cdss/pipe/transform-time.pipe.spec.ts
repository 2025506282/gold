/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { TransformTimePipe } from './transform-time.pipe';

describe('Pipe: TransformTime', () => {
  let pipe = new  TransformTimePipe();
  it('transforms "2019.12.12 12:12:12" to "12-12 12:12"', () => {
    expect(pipe.transform('2019.12.12 12:12:12')).toBe('12-12 12:12');
  });
  it('transforms "2019-10-9 10:10:10" to "10-09 10:10"', () => {
    expect(pipe.transform('2019-10-9 10:10:10')).toBe('10-09 10:10');
  });
  it('transforms "2019.2.2 2:2:2" to "02-02 02:02"', () => {
    expect(pipe.transform('2019.2.2 2:2:2')).toBe('02-02 02:02');
  });
});
