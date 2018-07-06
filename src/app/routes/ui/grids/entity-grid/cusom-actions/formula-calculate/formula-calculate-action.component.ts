import { ChangeDetectionStrategy, Component, Inject, forwardRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IGridEntity, IEntityGridAction, IMetadataEntityGridConfig } from '../../entity-grid.interface';
import { ToolbarItemType } from '@app/shared/components/titlebar/titlebar.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { EntityGridComponent } from '@app/routes/ui/grids/entity-grid/entity-grid.component';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-formula-calculate-action',
  templateUrl: './formula-calculate-action.component.html',
})
export class FormulaCalculateActionComponent extends DialogFunctions implements IEntityGridAction, OnInit {

  dialog: string;
  type = 'calculate';
  title = this.translateService.instant('default.buttons.calculate');
  buttonType = ButtonType.START;

  constructor(
    @Inject(forwardRef(() => EntityGridComponent)) private grid: EntityGridComponent<IGridEntity>,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
   }

  ngOnInit(): void {
    this.grid.actions.push(this);
  }

  get config(): IMetadataEntityGridConfig {
    return this.grid.config;
  }

  get selectedFormulaId(): number {
    return this.grid.selectedRows[0].id;
  }

  enabled(permissions: string[]): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.hasAll(permissions),
      this.grid.selectedRows$.map(rows => rows && rows.length === 1)
    ]);
  }

  action(): void {
    this.setDialog('calculateFormula');
    this.cdRef.markForCheck();
  }
}
