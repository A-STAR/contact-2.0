import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async as Async, TestBed } from '@angular/core/testing';

import { AreaComponent } from './area.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-area layout="column">
      <app-area initialSize="1">
        1
      </app-area>
      <app-area initialSize="2">
        2
      </app-area>
    </app-area>
  `,
})
class AreaColumnContainerComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-area layout="row">
      <app-area initialSize="1">
        1
      </app-area>
      <app-area initialSize="2">
        2
      </app-area>
    </app-area>
  `,
})
class AreaRowContainerComponent {}

describe('AreaComponent', () => {
  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          AreaComponent,
          AreaColumnContainerComponent,
          AreaRowContainerComponent,
        ],
      })
      .compileComponents();
  }));

  it('should render', () => {
    const fixture = TestBed.createComponent(AreaComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render column layout', () => {
    const fixture = TestBed.createComponent(AreaColumnContainerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render row layout', () => {
    const fixture = TestBed.createComponent(AreaRowContainerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
