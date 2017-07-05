import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ]
})
export class DropdownComponent {
  private _isOpen = false;

  @ViewChild('trigger') trigger: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.containsTarget(this.element, event) && !this.containsTarget(this.trigger, event)) {
      this._isOpen = false;
    }
  };

  constructor(private element: ElementRef) {}

  get isOpen(): boolean {
    return this._isOpen;
  }

  toggle(): void {
    this._isOpen = !this._isOpen;
  }

  open(): void {
    this._isOpen = true;
  }

  close(): void {
    this._isOpen = false;
  }

  private containsTarget(element: ElementRef, event: MouseEvent): boolean {
    return element.nativeElement.contains(event.target);
  }
}
