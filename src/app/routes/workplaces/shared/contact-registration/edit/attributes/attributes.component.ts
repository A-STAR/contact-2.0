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
export class ContactRegistrationAttributesComponent implements OnInit {
  attributes: ITreeNode[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
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
