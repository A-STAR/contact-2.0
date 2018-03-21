import { TestBed, inject } from '@angular/core/testing';

import { ActionGridService } from './action-grid.service';
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
      ]
    });

    // service = TestBed.get(ActionGridService);
    // massOpsService = TestBed.get(MassOperationsService);
  });

  it('should be created', inject([ActionGridService], (s: ActionGridService) => {
    expect(s).toBeTruthy();
  }));

});
