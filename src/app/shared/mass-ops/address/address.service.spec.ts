import { TestBed, inject } from '@angular/core/testing';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { AddressService } from './address.service';


class MockActionGridService {
  buildRequest(): any {
    return {};
  }
}

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressService,
        {
          provide: ActionGridService,
          useClass: MockActionGridService,
        }
      ]
    });
  });

  it('should be created', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));
});
