import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class HelpService {
  constructor(
    private configService: ConfigService,
    private translateService: TranslateService,
  ) {}

  open(key: string): void {
    const { currentLang } = this.translateService;
    const { url } = this.configService.config.help;

    if (key !== null && url) {
      const baseUrl = url.replace('{lang}', currentLang);
      const suffix = key ? `?${key}.htm` : key;
      window.open(`${baseUrl}${suffix}`);
    }
  }
}
