import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

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
  @Input() debtId: number;
  @Input() contactTypeCode: number;

  attributes: ITreeNode[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    this.contactRegistrationService.outcome$
      .filter(Boolean)
      .map(outcome => outcome.id)
      .flatMap(nodeId => this.attributesService.fetchAll(this.debtId, this.contactTypeCode, nodeId))
      .subscribe(attributes => {
        this.attributes = attributes;
        this.cdRef.markForCheck();
      });
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const data = {
      attributes: flatten(this.attributes)
        .map(node => node.data)
        .filter(attribute => attribute.typeCode)
        .map(attribute => ({
          ...getValue(attribute.typeCode, getRawValue(attribute)),
          code: attribute.code
        })),
    };
    this.attributesService.create(this.debtId, guid, data)
      .subscribe(() => {
        //
        this.cdRef.markForCheck();
      });
  }
}
