import { Injectable } from '@angular/core';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { DurationInputArg2 } from 'moment';
import * as moment from 'moment';

@Injectable()
export class DateTimeService {
  /**
   * |              | Moment | Mask |
   * |-------------:|:------:|:----:|
   * | Day          | DD     | dd   |
   * | Month        | MM     | mm   |
   * | Year         | YYYY   | yyyy |
   * | Hour         | HH     | HH   |
   * | Minute       | mm     | MM   |
   * | Second       | SS     | SS   |
   */
  private formatMap = {
    DD:   'dd',
    MM:   'mm',
    YYYY: 'yyyy',
    HH:   'HH',
    mm:   'MM',
    ss:   'SS',
  };

  /**
   * |              | Moment | Modifier |
   * |-------------:|:------:|:--------:|
   * | Day          | D      | d        |
   * | Month        | M      | m        |
   * | Year         | Y      | y        |
   * | Hour         | H      | h        |
   * | Minute       | m      | m        |
   * | Second       | S      | s        |
   */
  private modifierMap = {
    D: 'd',
    M: 'M',
    Y: 'y',
    H: 'h',
    m: 'm',
    s: 's',
  };

  getModifierFromMomentFormatLetter(format: string): DurationInputArg2 {
    return this.modifierMap[format];
  }

  getMaskParamsFromMomentFormat(format: string): any {
    const maskFormat = format.match(/(.)\1*/g).map(chunk => this.formatMap[chunk] || chunk).join('');
    return {
      keepCharPositions: true,
      // Do NOT use `.split('')` here!
      // See https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript
      mask: Array.from(maskFormat).map(c => c.match(/[a-z]/i) ? /\d/ : c),
      pipe: createAutoCorrectedDatePipe(maskFormat),
    };
  }

  /**
   * @param value base date
   * @param date date that holds year, month and day to set to base value
   */
  setDate(value: Date, date: Date): Date {
    const result = moment().set({ h: 0, m: 0, s: 0, ms: 0 }).toDate();
    if (value) {
      result.setTime(value.getTime());
    }
    result.setFullYear(date.getFullYear());
    result.setMonth(date.getMonth());
    result.setDate(date.getDate());
    return result;
  }

  /**
   * @param value base date
   * @param time time that holds hours, minutes, seconds and milliseconds to set to base value
   */
  setTime(value: Date, time: Date): Date {
    const result = new Date();
    if (value) {
      result.setTime(value.getTime());
    }
    result.setHours(time.getHours());
    result.setMinutes(time.getMinutes());
    result.setSeconds(time.getSeconds());
    result.setMilliseconds(time.getMilliseconds());
    return result;
  }
}
