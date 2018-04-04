import { TestBed, inject } from '@angular/core/testing';

import { MapYandexService } from './map-yandex.service';

describe('MapYandexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapYandexService]
    });
  });

  it('should be created', inject([MapYandexService], (service: MapYandexService) => {
    expect(service).toBeTruthy();
  }));
});
