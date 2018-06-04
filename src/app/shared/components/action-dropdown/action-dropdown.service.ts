import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { ICustomOperation } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';

@Injectable()
export class ActionDropdownService {
  static TYPE_CUSTOM_OPERATION = 2;

  readonly customOperations$ = new BehaviorSubject<ICustomOperation[]>(null);

  constructor(
    private customOperationService: CustomOperationService,
  ) {
    this.customOperationService.fetchOperations(ActionDropdownService.TYPE_CUSTOM_OPERATION)
      .subscribe(operations => this.customOperations$.next(operations));
  }
}
