import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';

describe('MapComponentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapRendererService]
    });
  });

  it('should be created', inject([MapRendererService], (service: MapRendererService) => {
    expect(service).toBeTruthy();
  }));
});
