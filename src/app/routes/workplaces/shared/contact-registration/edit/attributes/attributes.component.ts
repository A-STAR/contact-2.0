import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, mergeMap } from 'rxjs/operators';

import { IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { AttributesService } from '@app/routes/workplaces/shared/contact-registration/edit/attributes/attributes.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { flatten, makeKey, TYPE_CODES } from '@app/core/utils';
import { getRawValue, getValue } from '@app/core/utils/value';

const label = makeKey('modules.contactRegistration');

@Component({
  selector: 'app-contact-registration-attributes',
  templateUrl: './attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationAttributesComponent implements OnInit {
  attributes: ITreeNode[];
  columns$: Observable<IAGridColumn[]>;

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    const attrGridColumns: any[] = [
      { dataType: TYPE_CODES.STRING, name: 'code', isDataPath: true },
      { dataType: TYPE_CODES.STRING, name: 'name' },
      { dataType: TYPE_CODES.STRING, name: 'value',
        valueGetter: (row: any) => row.data.value || row.data.valueN || row.data.valueD },
      { dataType: TYPE_CODES.BOOLEAN, name: 'mandatory' },
    ].map(col => ({ ...col, label: label(`attributes.grid.${col.name}`)}));

    this.columns$ = this.gridService.getColumns(attrGridColumns, {});

    combineLatest(
      this.contactRegistrationService.params$,
      this.contactRegistrationService.outcome$,
    )
    .pipe(
      filter(([ params, outcome ]) => Boolean(params) && Boolean(outcome)),
      mergeMap(([ params, outcome ]) => this.attributesService.fetchAll(params.debtId, params.contactType, outcome.id)),
    )
    .subscribe(attributes => {
      this.attributes = attributes;
      this.cdRef.markForCheck();
    });
  }

  get data(): any {
    return flatten(this.attributes)
      .map(node => node.data)
      .filter(attribute => attribute.typeCode)
      .map(attribute => ({
        ...getValue(attribute.typeCode, getRawValue(attribute)),
        code: attribute.code,
      }));
  }
}
