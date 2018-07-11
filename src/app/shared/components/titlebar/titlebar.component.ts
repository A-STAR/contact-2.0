import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { defaultTo } from 'ramda';
import { of } from 'rxjs/observable/of';

import { ITitlebar, ITitlebarItem, ITitlebarButton } from './titlebar.interface';

import { ButtonService } from '@app/shared/components/button/button.service';

import { doOnceIf } from '@app/core/utils';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: [ './titlebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitlebarComponent implements OnChanges, OnInit {
  @Input() titlebar: ITitlebar;

  @Output() action = new EventEmitter<ITitlebarItem>();

  borderCls: object;
  items: ITitlebarItem[] = [];
  suppressCenterZone: boolean;
  label: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private buttonService: ButtonService,
  ) {}

  ngOnChanges(): void {
    this.label = this.titlebar && this.titlebar.label;
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    const classesDefault = defaultTo(of(''));
    const enabledDefault = defaultTo(of(true));
    this.borderCls = { 'no-border': this.titlebar && this.titlebar.suppressBorder === true };
    this.items = ((this.titlebar && this.titlebar.items) || this.items).map(item => ({
      ...item,
      classes: classesDefault(item.classes),
      enabled: enabledDefault(item.enabled),
    }));
    this.suppressCenterZone = (this.titlebar && this.titlebar.suppressCenterZone) || false;
    this.label = (this.titlebar && this.titlebar.label) || '';
  }

  onClick(item: ITitlebarItem): void {
    doOnceIf(item.enabled, () => {
      if (typeof item.action === 'function') {
        item.action();
      }
      this.action.emit(item);
    });
  }

  /**
   * Get the icon's css class, or show an exclamation if the icon class is not listed
   * @param item {ITitlebarButton}
   */
  getIconCls(item: ITitlebarButton): object {
    const iconCls = this.buttonService.getIcon(item.buttonType) || 'co-dialog-exclamation';
    const cls = { 'align-right': item.align === 'right' };
    return iconCls
      ? { ...cls, [iconCls]: true }
      : cls;
  }

  getLabel(item: ITitlebarButton): string {
    return this.buttonService.getLabel(item.buttonType) || null;
  }
}
