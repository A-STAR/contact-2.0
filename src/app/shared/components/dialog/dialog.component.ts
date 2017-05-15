import {
  Component, ElementRef, EventEmitter, Input, Output, OnDestroy, Renderer2, OnInit
} from '@angular/core';

import {EnvironmentContainer} from '../../../core/environment/environment.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnDestroy, OnInit {

  @Input() autoWidth: boolean;
  @Input() display: boolean;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  styles: CSSStyleDeclaration;

  constructor(private element: ElementRef,
              private renderer2: Renderer2,
              private environmentContainer: EnvironmentContainer) {
  }

  onVisibleChange(value: boolean): void {
    this.display = value;
    this.displayChange.emit(value);
  }

  onCloseClick(): void {
    this.onVisibleChange(false);
    this.onClose.emit(null);
  }

  /**
   * @override
   */
  ngOnInit(): void {
    if (this.autoWidth) {
      this.styles.width = 'width: auto;';
    }
    this.renderer2.appendChild(this.environmentContainer, this.element.nativeElement);
  }

  /**
   * @override
   */
  ngOnDestroy(): void {
    this.renderer2.removeChild(this.environmentContainer, this.element.nativeElement);
  }
}
