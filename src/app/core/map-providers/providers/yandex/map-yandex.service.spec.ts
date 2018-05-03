import { TestBed, inject } from '@angular/core/testing';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';
import { MapYandexService } from './map-yandex.service';


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

class MockMapRendererService {
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
          provide: MapRendererService,
          useClass: MockMapRendererService
        }
      ]
    });
  });

  it('should be created', inject([MapYandexService], (service: MapYandexService<any>) => {
    expect(service).toBeTruthy();
  }));
});
