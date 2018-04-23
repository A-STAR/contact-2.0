import { TestBed, inject } from '@angular/core/testing';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './map-google.service';
import { MapRendererService } from '../../renderer/map-renderer.service';

class MockConfigService {
  readonly config = {
    maps: {
      providers: {
        google: {
          apiKey: 'Google api key'
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


describe('MapGoogleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapGoogleService,
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

  it('should be created', inject([MapGoogleService], (service: MapGoogleService) => {
    expect(service).toBeTruthy();
  }));
});
