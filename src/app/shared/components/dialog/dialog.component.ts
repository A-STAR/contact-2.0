import { Component, ElementRef, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnDestroy {
  @Input() display: boolean;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onClose: EventEmitter<null> = new EventEmitter();

  constructor(private element: ElementRef) {
    document.body.appendChild(element.nativeElement);
  }

  onVisibleChange(value: boolean): void {
    this.display = value;
    this.displayChange.emit(value);
  }

  onCloseClick(): void {
    this.onVisibleChange(false);
    this.onClose.emit();
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.element.nativeElement);
  }
}
