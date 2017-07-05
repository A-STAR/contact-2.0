import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ]
})
export class DropdownComponent {
  private _isOpen = false;

  @Input() enabled = true;

  @ViewChild('trigger') trigger: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.containsTarget(this.element, event) && !this.containsTarget(this.trigger, event)) {
      this.setIsOpen(false);
    }
  };

  constructor(private element: ElementRef) {}

  get isOpen(): boolean {
    return this._isOpen;
  }

  toggle(): void {
    this.setIsOpen(!this._isOpen);
  }

  open(): void {
    this.setIsOpen(true);
  }

  close(): void {
    this.setIsOpen(false);
  }

  private setIsOpen(isOpen: boolean): void {
    if (this.enabled || !isOpen) {
      this._isOpen = isOpen;
    }
  }

  private containsTarget(element: ElementRef, event: MouseEvent): boolean {
    return element.nativeElement.contains(event.target);
  }
}
