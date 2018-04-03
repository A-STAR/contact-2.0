import { Injectable } from '@angular/core';

@Injectable()
export class HelpService {
  open(guiObjectId: number): void {
    console.log(`STUB: opening help for guiObjectId = ${guiObjectId}`);
  }
}
