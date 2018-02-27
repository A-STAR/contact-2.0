import { Component, ViewChild, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IOperator } from '../operator-details.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.operatorDetails.card');

@Component({
  selector: 'app-operator-card',
  templateUrl: './operator-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorCardComponent implements OnInit {

  @Input() operator: IOperator;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;

  ngOnInit(): void {
    this.controls = this.initControls();
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
            label: label('photo'), controlName: 'image', type: 'image', url: `/users/${this.operator.userId}/photo`,
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
