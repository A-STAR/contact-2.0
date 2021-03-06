import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IFormula } from '../formulas.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { FormulasService } from '../formulas.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-formulas-grid',
  templateUrl: './formulas-grid.component.html',
})
export class FormulasGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedFormula$ = new BehaviorSubject<IFormula>(null);

  columns: ISimpleGridColumn<IFormula>[] = [
    { prop: 'id', width: 50 },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_FORMULA_TYPE },
    { prop: 'comment' },
  ].map(addGridLabel('routes.utilities.formulas.grid'));

  toolbar: Toolbar = {
    label: 'routes.utilities.formulas.titlebar.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: this.formulasService.canEdit$,
        action: () => this.onAdd()
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedFormula$.value),
        enabled: combineLatestAnd([
          this.formulasService.canEdit$,
          this.selectedFormula$.map(Boolean)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('removeFormula'),
        enabled: combineLatestAnd([
          this.formulasService.canEdit$,
          this.selectedFormula$.map(Boolean)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.START,
        label: this.translateService.instant('default.buttons.calculate'),
        action: () => this.setDialog('calculateFormula'),
        enabled: combineLatestAnd([
          this.formulasService.canCalculate$,
          this.selectedFormula$.map(Boolean)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: this.formulasService.canView$
      }
    ]
  };

  dialog: string;

  private _formulas: Array<IFormula> = [];

  private viewPermissionSubscription: Subscription;
  private actionSubscription: Subscription;
  private formulaSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private formulasService: FormulasService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();

    this.actionSubscription = this.formulasService
      .getAction(FormulasService.MESSAGE_FORMULA_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedFormula$.next(this.selectedFormula);
      });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
    this.formulaSubscription.unsubscribe();
  }

  get formulas(): Array<IFormula> {
    return this._formulas;
  }

  get selectedFormula(): IFormula {
    return (this._formulas || [])
      .find(formula => this.selectedFormula$.value && formula.id === this.selectedFormula$.value.id);
  }

  get selection(): Array<IFormula> {
    const selectedFormula = this.selectedFormula;
    return selectedFormula ? [ selectedFormula ] : [];
  }

  onSelect([ formula ]: IFormula[]): void {
    this.selectedFormula$.next(formula);
  }

  onEdit(formula: IFormula): void {
    this.routingService.navigate([ String(formula.id) ], this.route);
  }

  onRemove(): void {
    const { id: formulaId } = this.selectedFormula;
    this.formulasService.delete(formulaId)
      .subscribe(() => {
        this.setDialog(null);
        this.selectedFormula$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }

  private fetch(): void {
    this.formulasService.fetchAll().subscribe(formulas => {
      this._formulas = formulas;
      this.cdRef.markForCheck();
    });
  }
}
