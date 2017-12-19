import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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

  constructor(private route: ActivatedRoute) { }

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
