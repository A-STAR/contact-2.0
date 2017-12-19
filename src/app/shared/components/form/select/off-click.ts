import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOffClick]'
})
export class OffClickDirective {
  @Input() appOffClick: Function;

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick($event: MouseEvent): void {
    this.appOffClick();
  }
}
