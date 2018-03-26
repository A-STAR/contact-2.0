import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, mergeMap } from 'rxjs/operators';

import { IContactTreeAttribute } from '@app/routes/utilities/contact-properties/contact-properties.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ValueGetterParams } from 'ag-grid/dist/lib/entities/colDef';

import { AttributesService } from '@app/routes/workplaces/shared/contact-registration/edit/attributes/attributes.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, getValue } from '@app/core/utils';
import { CellValueChangedEvent } from 'ag-grid';
import { IOutcome } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  selector: 'app-contact-registration-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationAttributesComponent implements OnInit {
  attributes: IContactTreeAttribute[];
  private editedAttributes: any = {};

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  columns: Array<ISimpleGridColumn<IContactTreeAttribute>> = [
    {
      prop: 'code', minWidth: 50, maxWidth: 80
    },
    {
      prop: 'name', minWidth: 150, maxWidth: 200, isGroup: true,
    },
    {
      prop: 'value', valueTypeKey: 'typeCode', minWidth: 100, maxWidth: 200,
      valueTypeParams: {
        dictCode: row => row.dictNameCode
      },
      edit: {
        dictCode: row => row.dictNameCode,
        editable: (params: ValueGetterParams) => params.data.disabledValue !== 1
      },
    },
    {
      prop: 'mandatory', minWidth: 40, maxWidth: 60,
      renderer: TickRendererComponent,
    },
  ].map(addGridLabel('routes.workplaces.shared.contactRegistration.edit.form.attributes.grid'));

  ngOnInit(): void {

    combineLatest(
      this.contactRegistrationService.params$,
      this.contactRegistrationService.outcome$,
    )
    .pipe(
      filter(([ params, outcome ]) => Boolean(params) && Boolean(outcome)),
      mergeMap(([ params, outcome ]) => this.attributesService.fetchAll(params.debtId, params.contactType, outcome.id)),
    )
    .filter(attrs => attrs.some(a => a.disabledValue !== 1))
    .subscribe(attributes => {
      this.attributes = attributes;
      this.cdRef.markForCheck();
    });
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    this.editedAttributes[event.rowIndex] = {
      ...getValue(event.data.typeCode, event.newValue),
      code: event.data.code
    };
  }

  get data(): any {
    return Object.keys(this.editedAttributes).map(key => this.editedAttributes[key]);
  }

}
