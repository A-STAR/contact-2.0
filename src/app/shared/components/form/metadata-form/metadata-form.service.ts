import { Injectable } from '@angular/core';

@Injectable()
export class MetadataFormService {
  onGridSelect(event: any): void {
    console.log(event);
  }
}
