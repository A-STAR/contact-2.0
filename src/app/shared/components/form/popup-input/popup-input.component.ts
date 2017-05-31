import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-input',
  templateUrl: './popup-input.component.html',
})
export class PopupInputComponent {
  @Input() value: string;
  @Input() placeholder: string;

  @Output() click: EventEmitter<void> = new EventEmitter<void>();

  togglePopup(): void {
    this.click.emit();
  }
}
