import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async as Async, TestBed } from '@angular/core/testing';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

import { AreaService } from './area.service';
import { SettingsService } from '@app/core/settings/settings.service';

import { AreaComponent } from './area.component';

class AreaServiceMock {
  getState(): number {
    return null;
  }
  saveState(): void {
  }
}

class SettingsServiceMock {
  onClear$ = new EmptyObservable();
}

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
        providers: [
          {
            provide: AreaService,
            useClass: AreaServiceMock,
          },
          {
            provide: SettingsService,
            useClass: SettingsServiceMock,
          }
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
