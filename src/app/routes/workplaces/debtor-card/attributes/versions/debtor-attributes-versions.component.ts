import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';

@Component({
  selector: 'app-debtor-attributes-versions',
  templateUrl: './debtor-attributes-versions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorAttributesVersionsComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorAttributesVersionsComponent';
  static ENTITY_TYPE_DEBT = 19;

  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentTabService: ContentTabService
  ) { }

  ngOnInit(): void {

    this.paramsSub = this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params) {
          this.attributeId = Number(params.get('attributeId'));

          if ((this.entityId = Number(params.get('debtId')))) {
            this.entityTypeId = DebtorAttributesVersionsComponent.ENTITY_TYPE_DEBT;
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }


  onBack(): void {
    this.contentTabService.gotoParent(this.router, 2);
  }

}




