import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-attributes-versions',
  templateUrl: './debtor-attributes-versions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorAttributesVersionsComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorAttributesVersionsComponent';

  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private debtorCardService: DebtorCardService,
  ) { }

  ngOnInit(): void {

    this.paramsSub = combineLatest(
      this.route.paramMap,
      this.debtorCardService.entityId$,
      this.debtorCardService.entityTypeId$
    )
      .subscribe(([params, entityId, entityTypeId]: [ParamMap, number, number]) => {
        if (params) {
          this.attributeId = Number(params.get('attributeId'));
        }
        if (entityId) {
          this.entityId = entityId;
        }
        if (entityTypeId) {
          this.entityTypeId = entityTypeId;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  onBack(): void {
    this.router.navigate([ '..', '..' ], { relativeTo: this.route });
  }
}




