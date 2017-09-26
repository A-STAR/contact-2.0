import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IAttribute } from '../../attribute.interface';
import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { AttributeService } from '../../attribute.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit {
  @Input() attributeId: number;

  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    {
      label: labelKey('name'),
      controlName: 'name',
      type: 'text',
    },
    {
      label: labelKey('code'),
      controlName: 'code',
      type: 'text',
    },
    {
      label: labelKey('typeCode'),
      controlName: 'typeCode',
      type: 'select',
      options: []
    },
    // {
    //   label: labelKey('comment'),
    //   controlName: 'comment',
    //   type: 'textarea',
    // },
    {
      label: labelKey('disabledValue'),
      controlName: 'disabledValue',
      type: 'checkbox',
    },
  ]
  attribute: IAttribute;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_VARIABLE_TYPE).subscribe(options => {
      this.getControl('typeCode').options = options;
    });
    this.fetch(this.attributeId);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private fetch(id: number): void {
    this.attributeService.fetch(id).subscribe(attribute => {
      this.attribute = attribute;
      this.cdRef.markForCheck();
    });
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }
}
