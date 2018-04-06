import { TestBed, inject } from '@angular/core/testing';

import { MapYandexService } from './map-yandex.service';
import { ConfigService } from '@app/core/config/config.service';
import { PopupService } from '../../popups/popup.service';


class MockConfigService {
  readonly config = {
    maps: {
      providers: {
        yandex: {
          apiKey: 'Yandex api key'
        }
      }
    }
   };
}

class MockPopupService {
  render(): any {
    return { compRef: {}, el: {} };
  }
}

describe('MapYandexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapYandexService,
        {
          provide: ConfigService,
          useClass: MockConfigService
        },
        {
          provide: PopupService,
          useClass: MockPopupService
        }
      ]
    });
  });

  it('should be created', inject([MapYandexService], (service: MapYandexService) => {
    expect(service).toBeTruthy();
  }));
});
