import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-html-renderer',
  template: '<span [innerHTML]="value"></span>',
})
export class HtmlRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  constructor(
    private domSanitizer: DomSanitizer,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(this.params.value);
  }
}
