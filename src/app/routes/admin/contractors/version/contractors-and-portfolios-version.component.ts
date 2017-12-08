import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute, IAttributeVersionParams } from '../../../../shared/gui-objects/widgets/entity-attribute/attribute.interface';

import { AttributeService } from '../../../../shared/gui-objects/widgets/entity-attribute/attribute.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-contractors-and-portfolios-version',
  templateUrl: './contractors-and-portfolios-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsAndPortfoliosVersionComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'ContractorsAndPortfoliosVersionComponent';

  selectedAttribute: IAttribute;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(private attributeService: AttributeService) { }

  ngOnInit(): void {

    this.paramsSub = this.attributeService.versionParams$
      .subscribe((params: IAttributeVersionParams) => {
        if (params) {
          this.selectedAttribute = params.selectedAttribute;
          this.entityId = params.entityId;
          this.entityTypeId = params.entityTypeId;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

}
