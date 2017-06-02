import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateConverterService {

  constructor() {
  }

  formatDate(dateAsString: string, useTime: boolean = false) {
    const momentDate = moment(dateAsString);
    if (momentDate.isValid()) {
      return useTime
        ? momentDate.format('DD.MM.YYYY hh:mm:ss')
        : momentDate.format('DD.MM.YYYY');
    } else {
      return dateAsString;
    }
  }
}
