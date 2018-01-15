import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { IOperator } from '../operator-details.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { OperatorDetailsService } from '../operator-details.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.operatorDetails.card');

@Component({
  selector: 'app-operator-card',
  templateUrl: './operator-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorCardComponent implements OnInit {

  @Input() userId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;

  operator: Partial<IOperator>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorDetailsService: OperatorDetailsService,
  ) {}

  ngOnInit(): void {
    this.operatorDetailsService.fetch(this.userId)
      .pipe(first())
      .subscribe(operator => {
        this.operator = operator;
        this.controls = this.initControls();
        this.cdRef.markForCheck();
      });
  }

  private initControls(): Array<IDynamicFormItem> {
    return [
      {
        children: [
          {
            children: [
              { label: label('fullName'), controlName: 'fullName', type: 'text', disabled: true },
              { label: label('organization'), controlName: 'organization', type: 'text', disabled: true },
              { label: label('position'), controlName: 'position', type: 'text', disabled: true },
            ],
            width: 9
          },
          {
            label: label('photo'), controlName: 'image', type: 'image', url: `/users/${this.userId}/photo`,
            disabled: true, width: 3, height: 178
          }
        ],
      },
      { label: label('roleCode'), controlName: 'roleCode', type: 'selectwrapper', disabled: true, lookupKey: 'roles' },
      { label: label('email'), controlName: 'email', type: 'text', disabled: true },
      { label: label('mobPhone'), controlName: 'mobPhone', type: 'text', disabled: true },
      { label: label('workPhone'), controlName: 'workPhone', type: 'text', disabled: true },
      { label: label('intPhone'), controlName: 'intPhone', type: 'text', disabled: true },
    ];
  }
}
