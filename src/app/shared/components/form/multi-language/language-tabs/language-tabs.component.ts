import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';

import { IMultiLanguageOption } from '../multi-language.interface';

@Component({
  selector: 'app-language-tabs',
  templateUrl: './language-tabs.component.html',
  styleUrls: [ './language-tabs.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageTabsComponent {
  @Input() langOptions: IMultiLanguageOption[];
  @Output() languageChange = new EventEmitter<IMultiLanguageOption>(null);

  constructor(private cdRef: ChangeDetectorRef) {}

  onClick(index: number): void {
    this.langOptions = this.langOptions.map((o, i) => ({ ...o, active: i === index }));
    this.cdRef.markForCheck();
    this.languageChange.emit(this.langOptions[index]);
  }
}
