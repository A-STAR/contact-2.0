import { TestBed, inject } from '@angular/core/testing';

import { MapComponentsService } from './map-components.service';

describe('MapComponentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapComponentsService]
    });
  });

  it('should be created', inject([MapComponentsService], (service: MapComponentsService) => {
    expect(service).toBeTruthy();
  }));
});
