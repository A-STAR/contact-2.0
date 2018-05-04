import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

import { IDropdownPosition } from './dropdown.interface';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ],
  animations: [
    trigger(
      'isOpen', [
        state('void', style({ opacity: 0 })),
        state('*', style({ opacity: 1 })),
        transition(':enter', animate('150ms ease-out')),
        transition(':leave', animate('150ms ease-in')),
      ]
    )
  ]
})
/**
 * @deprecated
 * NOTE: prefer using [appDropdown] directive
 */
export class DropdownComponent {
  private _isOpen = false;

  @Input() enabled = true;
  @Input() displayArrow = false;
  @Input() fullWidth = false;
  @Input() position: IDropdownPosition = 'center';

  @ViewChild('trigger') trigger: ElementRef;

  constructor(private element: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.containsTarget(this.element, event) && !this.containsTarget(this.trigger, event)) {
      this.setIsOpen(false);
    }
  }

  get ngClass(): object {
    return {
      dropdown: true,
      left: this.position === 'left',
      right: this.position === 'right',
      arrow: this.displayArrow,
      full: this.fullWidth,
    };
  }

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
