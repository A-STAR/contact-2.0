import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChildren,
  ViewChild,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

import { EntityType } from '@app/core/entity/entity.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { SplitComponent, SplitAreaDirective } from 'angular-split';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyComponent implements AfterViewInit {

  @ViewChild(SplitComponent) splitEl: SplitComponent;
  @ViewChildren(SplitAreaDirective) areas: QueryList<SplitAreaDirective>;

  @Input() personId: number;
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
