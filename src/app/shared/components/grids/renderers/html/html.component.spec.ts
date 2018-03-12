import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlRendererComponent } from './html.component';

describe('HtmlRendererComponent', () => {
  let fixture: ComponentFixture<HtmlRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          HtmlRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlRendererComponent);
  });

  it('should render plain text', () => {
    const value = 'plain text';
    fixture.componentInstance.agInit({ value } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render html', () => {
    const value = '<p style="color: red;">html</p>';
    fixture.componentInstance.agInit({ value } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
