import { TestBed, inject } from '@angular/core/testing';

import { ActionGridService } from './action-grid.service';

describe('ActionGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionGridService]
    });
  });

  it('should be created', inject([ActionGridService], (service: ActionGridService) => {
    expect(service).toBeTruthy();
  }));
});
