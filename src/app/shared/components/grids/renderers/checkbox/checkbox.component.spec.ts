import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CheckModule } from '@app/shared/components/form/check/check.module';

import { CheckboxCellRendererComponent } from './checkbox.component';

describe('CheckboxCellRendererComponent', () => {
  let fixture: ComponentFixture<CheckboxCellRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          CheckModule,
          FormsModule,
        ],
        declarations: [
          CheckboxCellRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCellRendererComponent);
  });

  it('should render checkbox renderer', () => {
    fixture.componentInstance.agInit({
      node: {
        setDataValue: () => {},
      },
      value: false,
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
