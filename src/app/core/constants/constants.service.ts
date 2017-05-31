import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../shared/components/grid/grid.service';
import { ValueConverterService } from '../converter/value/value-converter.service';
import { IConstant, IConstantsResponse, TConstantValue } from './constants.interface';

@Injectable()
export class ConstantsService {

  private constants: Map<string, TConstantValue> = new Map<string, TConstantValue>();

  constructor(private gridService: GridService, private valueConverterService: ValueConverterService) {
    // TODO Temp solution
    this.loadConstants()
      .take(1)
      .subscribe(
        () => {},
        // TODO: log using notification service
        err => console.error(err)
      );
  }

  public loadConstants(): Observable<IConstantsResponse> {
    return this.gridService.read('/api/constants')
      .map((response: IConstantsResponse) => {
        response.constants.forEach((constant: IConstant) => {
          this.constants.set(constant.name, this.valueConverterService.deserialize(constant).value);
        });
        return response;
      });
  }

  public get(constantName: string): TConstantValue {
    return this.constants.get(constantName);
  }
}
