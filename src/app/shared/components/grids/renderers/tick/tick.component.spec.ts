import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickRendererComponent } from './tick.component';

describe('TickRendererComponent', () => {
  let fixture: ComponentFixture<TickRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          TickRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickRendererComponent);
  });

  it('should render tick renderer with false value', () => {
    fixture.componentInstance.agInit({ value: false } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render tick renderer with true value', () => {
    fixture.componentInstance.agInit({ value: true } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
