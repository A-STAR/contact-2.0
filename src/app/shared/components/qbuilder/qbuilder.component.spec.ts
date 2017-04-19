import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QBuilderComponent } from './qbuilder.component';

describe('QbuilderComponent', () => {
  let component: QBuilderComponent;
  let fixture: ComponentFixture<QBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
