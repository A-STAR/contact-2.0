import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute, IAttributeVersionParams } from '../../../../shared/gui-objects/widgets/entity-attribute/attribute.interface';

import { AttributeService } from '../../../../shared/gui-objects/widgets/entity-attribute/attribute.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router/src/shared';

@Component({
  selector: 'app-contractors-and-portfolios-version',
  templateUrl: './contractors-and-portfolios-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsAndPortfoliosVersionComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'ContractorsAndPortfoliosVersionComponent';
  static ENTITY_TYPE_CONTRACTOR = 13;
  static ENTITY_TYPE_PORTFOLIO = 15;

  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(private attributeService: AttributeService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.paramsSub = this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params) {
          this.attributeId = parseInt(params.get('attributeId'), 10);

          if ((this.entityId = parseInt(params.get('portfolioId'), 10))) {
            this.entityTypeId = ContractorsAndPortfoliosVersionComponent.ENTITY_TYPE_PORTFOLIO;
          } else {
            this.entityId = parseInt(params.get('contractorId'), 10);
            this.entityTypeId = ContractorsAndPortfoliosVersionComponent.ENTITY_TYPE_CONTRACTOR;
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

}
