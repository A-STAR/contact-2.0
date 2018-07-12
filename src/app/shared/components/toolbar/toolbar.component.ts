import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { of } from 'rxjs/observable/of';

import { ToolbarItem, Toolbar } from './toolbar.interface';

import { defaultTo } from 'ramda';

@Component({
  selector: 'app-toolbar',
  styleUrls: [ './toolbar.component.scss' ],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() toolbar: Toolbar;
  @Input() toolbarClass: any = '';
  @Output() action = new EventEmitter<ToolbarItem>();

  customCls: object;
  items: ToolbarItem[] = [];
  suppressCenterZone: boolean;
  label: string;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.label = this.toolbar && this.toolbar.label;
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    const classesDefault = defaultTo(of(''));
    const enabledDefault = defaultTo(of(true));

    this.customCls = { 'has-border': this.hasBorder, [this.toolbarClass]: true };

    this.items = ((this.toolbar && this.toolbar.items) || this.items)
      .map(item => ({
          ...item,
          classes: classesDefault(item.classes),
          enabled: enabledDefault(item.enabled),
        })
      );

    this.suppressCenterZone = (this.toolbar && this.toolbar.suppressCenterZone) || false;
    this.label = (this.toolbar && this.toolbar.label) || '';
  }

  onAction(item: ToolbarItem): void {
    this.action.emit(item);
  }

  private get hasBorder(): boolean {
    return this.toolbar && (typeof this.toolbar.showBorder !== 'undefined' ? this.toolbar.showBorder : !!this.toolbar.label);
  }
}
