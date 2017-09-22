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

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit {
  @Input() attributeCode: number;
  @Input() debtId: number;
  @Input() entityTypeId: number;

  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    {
      label: labelKey('value'),
      controlName: 'value',
      type: 'text',
      required: true,
    },
    {
      label: labelKey('comment'),
      controlName: 'comment',
      type: 'textarea',
    },
  ];
  attribute: IAttribute;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
    this.submit.emit(this.form.requestValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private fetch(): void {
    this.attributeService.fetch(this.entityTypeId, this.debtId, this.attributeCode).subscribe(attribute => {
      this.attribute = attribute;
      this.cdRef.markForCheck();
    });
  }
}
