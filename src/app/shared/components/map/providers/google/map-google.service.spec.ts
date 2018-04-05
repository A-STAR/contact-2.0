import { TestBed, inject } from '@angular/core/testing';

import { MapGoogleService } from './map-google.service';
import { ConfigService } from '@app/core/config/config.service';
import { PopupService } from '../../popups/popup.service';

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

class MockPopupService {
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
          provide: PopupService,
          useClass: MockPopupService
        }
      ]
    });
  });

  it('should be created', inject([MapGoogleService], (service: MapGoogleService) => {
    expect(service).toBeTruthy();
  }));
});
