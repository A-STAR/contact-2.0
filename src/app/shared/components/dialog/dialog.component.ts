import {
  Component, ElementRef, EventEmitter, Input, Output, OnDestroy, Renderer2, OnInit
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnDestroy, OnInit {

  @Input() autoWidth: boolean;
  @Input() display = true;
  @Input() styles: CSSStyleDeclaration = {} as CSSStyleDeclaration;
  @Output() close = new EventEmitter<void>();

  constructor(
    private element: ElementRef,
    private renderer2: Renderer2,
  ) { }

  onClose(): void {
    this.display = false;
    this.close.emit(null);
  }

  ngOnInit(): void {
    if (this.autoWidth && !this.styles.width) {
      this.styles.width = 'auto';
    }
    this.renderer2.appendChild(document.body, this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer2.removeChild(document.body, this.element.nativeElement);
  }
}
