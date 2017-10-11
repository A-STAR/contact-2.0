import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';

type IListener = () => void;

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements OnInit, AfterContentInit, OnDestroy {
  static OFFSET = 2;

  @ContentChild('dropdownContent') content: ElementRef;
  @ContentChild('dropdownParent') parent: ElementRef;
  @ContentChild('dropdownTrigger') trigger: ElementRef;

  private isExpanded: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.collapse();
  }

  ngAfterContentInit(): void {
    this.triggerClickListener = this.createTriggerClickListener();
  }

  ngOnDestroy(): void {
    this.collapse();
    this.removeListener(this.triggerClickListener);
  }

  close(): void {
    this.collapse();
  }

  private toggle(): void {
    this.isExpanded ? this.collapse() : this.expand();
  }

  private expand(): void {
    this.isExpanded = true;
    this.renderer.appendChild(document.body, this.contentElement);
    this.cdRef.detectChanges();
    const { top, left, width } = this.getPosition();
    this.setStyles(this.contentElement, {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
    });
    this.outsideClickListener = this.createOutsideClickListener();
    this.outsideScrollListener = this.createOutsideScrollListener();
  }

  private collapse(): void {
    this.isExpanded = false;
    this.removeListener(this.outsideClickListener);
    this.removeListener(this.outsideScrollListener);
    this.renderer.removeChild(document.body, this.contentElement);
  }

  private getPosition(): any {
    const contentRect: ClientRect = this.contentElement.getBoundingClientRect();
    const parentRect: ClientRect = this.parentElement.getBoundingClientRect();
    const top = parentRect.bottom + contentRect.height > window.innerHeight
      ? parentRect.top - contentRect.height - DropdownDirective.OFFSET
      : parentRect.bottom + DropdownDirective.OFFSET;
    const left = parentRect.left;
    const width = parentRect.width;
    return { top, left, width };
  }

  private setStyles(element: any, styles: object): void {
    Object.keys(styles).forEach(key => this.renderer.setStyle(element, key, styles[key]));
  }

  private createTriggerClickListener(): IListener {
    return this.renderer.listen(this.triggerElement, 'click', () => {
      this.toggle();
    });
  }

  private createOutsideClickListener(): IListener {
    return this.renderer.listen(document, 'click', (event: MouseEvent) => {
      const { target } = event;
      if (!this.contentElement.contains(target) && !this.triggerElement.contains(target)) {
        this.collapse();
      }
    });
  }

  private createOutsideScrollListener(): IListener {
    return this.renderer.listen(document, 'scroll', () => {
      this.collapse();
    });
  }

  private removeListener(listener: IListener): void {
    if (listener) {
      listener();
      listener = null;
    }
  }

  private triggerClickListener: IListener;
  private outsideClickListener: IListener;
  private outsideScrollListener: IListener;

  private get contentElement(): any {
    return this.content.nativeElement;
  }

  private get parentElement(): any {
    return this.parent
      ? this.parent.nativeElement
      : this.trigger.nativeElement;
  }

  private get triggerElement(): any {
    return this.trigger.nativeElement;
  }
}
