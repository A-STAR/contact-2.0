import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navsearch',
  templateUrl: './navsearch.component.html',
  styleUrls: ['./navsearch.component.scss'],
})
export class NavsearchComponent implements AfterViewInit, OnInit {
  @Output() close = new EventEmitter<void>();

  isOpen = false;
  term: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private el: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeNavSearch();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyup(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.closeNavSearch();
    }
  }

  ngOnInit(): void {
    this.isOpen = true;
    this.cdRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.querySelector('input').focus();
  }

  closeNavSearch(): void {
    this.isOpen = false;
    this.cdRef.markForCheck();
    this.close.emit();
  }

  onSubmit(): void {
    // send this.term to BE
  }
}
