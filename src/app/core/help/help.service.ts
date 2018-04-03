import { Injectable } from '@angular/core';

@Injectable()
export class HelpService {
  open(guiObjectId: number): void {
    // tslint:disable-next-line:no-console
    console.log(`STUB: opening help for guiObjectId = ${guiObjectId}`);
  }
}
