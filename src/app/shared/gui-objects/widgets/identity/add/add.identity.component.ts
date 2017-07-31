import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { IIDentityResponse, IIdentityDoc } from '../identity.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { EntityBaseComponent } from '../../../../components/entity/edit/entity.base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-identity',
  templateUrl: './add.identity.component.html',
})

export class AddIdentityComponent extends EntityBaseComponent<IIdentityDoc> implements OnInit, OnDestroy {

  @Input() identityDoc: IIdentityDoc[];
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() add: EventEmitter<IIdentityDoc> = new EventEmitter<IIdentityDoc>();

  private selected: IIdentityDoc[];
  private localizedOptions: any;
  private langSub: Subscription;

  columns: Array<any> = [
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'dsc', minWidth: 70 },
  ];

  formData: IIdentityDoc;

  constructor(private valueConverterService: ValueConverterService) {
    super();
   }

  ngOnInit(): void {
    this.formData = {
      ...this.editedEntity,
    };
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    // this.langSub.unsubscribe();
  }

  // onCancel(): void {
  //   this.cancel.emit();
  // }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.onCancel();
    }
  }

  onSave(): void {
    // this.add.emit(this.selected);
  }

  canSave(): boolean {
    return !!this.editedEntity;
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'identityDocs.grid.docTypeCode',
        controlName: 'docTypeCode',
        type: 'number',
        required: true,
      },
      {
        label: 'identityDocs.grid.docNumber',
        controlName: 'docNumber',
        type: 'text',
      },
      {
        label: 'identityDocs.grid.issueDate',
        controlName: 'issueDate',
        type: 'datepicker',
        required: true,
      },
      {
        label: 'identityDocs.grid.issuePlace',
        controlName: 'issuePlace',
        type: 'text',
        required: true,
      },
      {
        label: 'identityDocs.grid.isMain',
        controlName: 'isMain',
        type: 'boolean',
        required: true,
      },
    ];
  }
}
