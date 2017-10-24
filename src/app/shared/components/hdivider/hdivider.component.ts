import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hdivider',
  templateUrl: 'hdivider.component.html',
  styleUrls: [ './hdivider.component.scss' ]
})

export class HDividerComponent implements OnInit, OnDestroy {
  @Input() className = 'hdivider-default';

  handle: HTMLElement;
  dragStart: Function;
  drag: Function;
  dragEnd: Function;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) { }

  @Input() callback: Function = () => {};

  ngOnInit(): void {
    if (!this.callback) {
      return;
    }
    if (typeof this.callback !== 'function') {
      throw Error('Callback must be a function');
    }
    this.handle = this.element.nativeElement.querySelector('.divider-handle');
    this.dragStart = this.renderer.listen(this.handle, 'dragstart', () => {});
    // this.drag = this.renderer.listen(this.handle, 'drag', (e) => console.log('y', e.clientY, e.offsetY, e.screenY));
    this.dragEnd = this.renderer.listen(this.handle, 'dragend', (e) => this.callback(e.offsetY));
  }

  ngOnDestroy(): void {
    // Unregister all handlers
    if (this.dragStart) { this.dragStart(); }
    if (this.drag) { this.drag(); }
    if (this.dragEnd) { this.dragEnd(); }
  }
}
