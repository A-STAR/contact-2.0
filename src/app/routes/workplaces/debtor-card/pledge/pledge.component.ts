import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { EntityType } from '@app/core/entity/entity.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { SplitComponent, SplitAreaDirective } from 'angular-split';

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' }
})
export class PledgeComponent implements AfterViewInit {

  @ViewChild(SplitComponent) splitEl: SplitComponent;
  @ViewChildren(SplitAreaDirective) areas: QueryList<SplitAreaDirective>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngAfterViewInit(): void {
    // NOTE: tab container has height 0 when component is initialized
    setTimeout(() => {
      this.areas.forEach(a => this.splitEl.updateArea(a, true, true));
      this.cdRef.markForCheck();
    }, 0);
  }

  readonly displayAttributes$ = this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', EntityType.PROPERTY);
}
