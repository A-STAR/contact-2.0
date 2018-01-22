import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, mergeMap } from 'rxjs/operators';

import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { AttributesService } from './attributes.service';
import { ContactRegistrationService } from '../../contact-registration.service';

import { flatten } from '@app/core/utils';
import { getRawValue, getValue } from '@app/core/utils/value';

@Component({
  selector: 'app-contact-registration-attributes',
  templateUrl: './attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesComponent implements OnInit {
  attributes: ITreeNode[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.contactRegistrationService.contactType$,
      this.contactRegistrationService.debtId$,
      this.contactRegistrationService.outcome$,
    )
    .pipe(
      filter(([ contactType, debtId, outcome ]) => Boolean(contactType && debtId && outcome)),
      mergeMap(([ contactType, debtId, outcome ]) => this.attributesService.fetchAll(debtId, contactType, outcome.id))
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
