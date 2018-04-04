import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class MapYandexService {

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;
  constructor(
    private configService: ConfigService
  ) {
    // tslint:disable-next-line:no-console
    console.log(this.apiKey);
  }

  init(): void {
    // tslint:disable-next-line:no-console
    console.log('Map Yandex Service inited');
  }

}
