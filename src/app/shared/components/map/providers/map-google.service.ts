import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class MapGoogleService {
  readonly apiKey = this.configService.config.maps.providers.google;
  constructor(
    private configService: ConfigService
  ) {
    // tslint:disable-next-line:no-console
    console.log(this.apiKey);
  }

  init(): void {
    // tslint:disable-next-line:no-console
    console.log('Google Service inited');
  }

}
