import { TestBed, inject } from '@angular/core/testing';

import { GridsTreeActionService } from './grids-tree-action.service';

describe('GridsTreeActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridsTreeActionService]
    });
  });

  it('should be created', inject([GridsTreeActionService], (service: GridsTreeActionService) => {
    expect(service).toBeTruthy();
  }));
});
