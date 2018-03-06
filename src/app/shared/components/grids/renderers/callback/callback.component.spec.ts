import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackRendererComponent } from './callback.component';

describe('CallbackCellRendererComponent', () => {
  let fixture: ComponentFixture<CallbackRendererComponent>;
  const mockCallback = (value: any) => (value || { renderCase: 'defaultString' }).renderCase;
  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          CallbackRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackRendererComponent);
  });

  it('should invoke passed renderer callback', () => {
    const agGridParams = {
      rendererCallback: mockCallback,
      value: null,
    };

    const spy = spyOn(agGridParams, 'rendererCallback')
    .and
    .returnValue('');

    fixture.componentInstance.agInit(agGridParams as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
  });

  it('should render transformed value passed through callback', () => {
    fixture.componentInstance.agInit({
      rendererCallback: mockCallback,
      data: {
        renderCase: 'myFancyString',
      },
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
