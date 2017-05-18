import { Component } from '@angular/core';

import { SettingsService } from '../../core/settings/settings.service';
import { ThemesService } from '../../core/themes/themes.service';
import { TranslatorService } from '../../core/translator/translator.service';
import { ILanguage } from '../../core/translator/translator.interface';

@Component({
  selector: 'app-offsidebar',
  templateUrl: './offsidebar.component.html',
  styleUrls: ['./offsidebar.component.scss']
})
export class OffsidebarComponent {

  currentTheme: any ;
  selectedLanguage: string;

  constructor(public settings: SettingsService, public themes: ThemesService, public translator: TranslatorService) {
    this.currentTheme = themes.getDefaultTheme();
    this.selectedLanguage = this.getLangs()[0].code;
  }

  setTheme(): void {
    this.themes.setTheme(this.currentTheme);
  }

  getLangs(): ILanguage[] {
    return this.translator.getAvailableLanguages();
  }

  setLang(value: string): void {
    this.translator.useLanguage(value);
  }
}
