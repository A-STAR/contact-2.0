import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ICustomOperation } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';

import { ActionGridService } from './action-grid.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

class MockMassOpsService {
  nonDlgActions = {
    openDebtCard: () => null,
    openDebtCardByDebtor: () => null,
    openIncomingCall: () => null
  };

  openDebtCard(): void {}
  openDebtCardByDebtor(): void {}
  openIncomingCall(): void {}

}

class MockCustomOperationService {
  fetchOperations(): Observable<ICustomOperation[]> {
    return of([]);
  }
}

describe('ActionGridService', () => {
  // let service: ActionGridService;
  // let massOpsService: MassOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActionGridService,
        {
          provide: MassOperationsService,
          useClass: MockMassOpsService,
        },
        {
          provide: CustomOperationService,
          useClass: MockCustomOperationService
        }
      ]
    });

    // service = TestBed.get(ActionGridService);
    // massOpsService = TestBed.get(MassOperationsService);
  });

  it('should be created', inject([ActionGridService], (s: ActionGridService) => {
    expect(s).toBeTruthy();
  }));

});
