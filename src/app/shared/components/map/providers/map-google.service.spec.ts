import { TestBed, inject } from '@angular/core/testing';

import { MapGoogleService } from './map-google.service';

describe('MapGoogleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapGoogleService]
    });
  });

  it('should be created', inject([MapGoogleService], (service: MapGoogleService) => {
    expect(service).toBeTruthy();
  }));
});
