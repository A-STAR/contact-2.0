import { Component, ViewChild } from '@angular/core';

import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html'
})
export class ContractorEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = [
    { label: 'contractors.grid.name', controlName: 'name', type: 'text', required: true },
    { label: 'contractors.grid.fullName', controlName: 'fullName', type: 'text', required: true },
    { label: 'contractors.grid.smsName', controlName: 'smsName', type: 'text' },
    { label: 'contractors.grid.responsibleId', controlName: 'responsibleId', type: 'text' },
    { label: 'contractors.grid.typeCode', controlName: 'typeCode', type: 'text' },
    { label: 'contractors.grid.phone', controlName: 'phone', type: 'text' },
    { label: 'contractors.grid.address', controlName: 'address', type: 'text' },
    { label: 'contractors.grid.comment', controlName: 'comment', type: 'text' },
  ];

  formData = null;

  constructor(private contentTabService: ContentTabService) {}

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    console.log('Submitting...');
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/contractors');
  }
}
