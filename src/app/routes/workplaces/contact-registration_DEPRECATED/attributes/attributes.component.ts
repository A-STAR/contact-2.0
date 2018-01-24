import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { AttributesService } from './attributes.service';
import { ContactRegistrationService } from '../contact-registration.service';

import { flatten } from '../../../../core/utils';
import { getRawValue, getValue } from '../../../../core/utils/value';

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
    private accordionService: AccordionService,
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    this.contactRegistrationService.selectedNode$
      .filter(Boolean)
      .map(node => node.id)
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
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }

  private get selectedContact(): any {
    return this.contactRegistrationService.selectedNode$.value.data;
  }
}
