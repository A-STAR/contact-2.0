import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ViewChild, Output, EventEmitter, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IPerson } from '../person-select.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { PersonSelectService } from '../person-select.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { Grid2Component } from '@app/shared/components/grid2/grid2.component';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { isEmpty, range, addLabelForEntity, combineLatestAnd } from '@app/core/utils';
import { DialogFunctions } from '@app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-grid',
  host: { class: 'full-height' },
  templateUrl: './person-select-grid.component.html',
})
export class PersonSelectGridComponent extends DialogFunctions implements OnInit {

  @Output() select = new EventEmitter<IPerson>();

  @ViewChild(Grid2Component) grid: Grid2Component;

  dialog;

  toolbarItems: Array<IToolbarItem>;

  columns$ = this.gridService.getColumns([
    { dataType: 1, name: 'id' },
    { dataType: 3, name: 'personFullName' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, name: 'typeCode' },
    { dataType: 2, name: 'birthDate' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_GENDER, name: 'genderCode' },
    { dataType: 3, name: 'passportNumber' },
    ...range(1, 10).map(i => ({ dataType: 3, name: `stringValue${i}` })),
  ].map(addLabelForEntity('person')), {});

  rows: IPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  private selectedPerson$ = new BehaviorSubject<IPerson>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private personSelectService: PersonSelectService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userPermissionsService.has('CONTACT_PERSON_ADD')
      .pipe(first())
      .filter(Boolean)
      .subscribe(() => {
        this.toolbarItems = [
          {
            type: ToolbarItemTypeEnum.BUTTON_ADD,
            action: () => this.setDialog('create'),
            enabled: this.userPermissionsService.has('PERSON_ADD')
          },
          {
            type: ToolbarItemTypeEnum.BUTTON_EDIT,
            action: () => this.setDialog('edit'),
            enabled: combineLatestAnd([
              this.userPermissionsService.has('PERSON_EDIT'),
              this.selectedPerson$.map(Boolean)
            ])
          }
        ];
      });
  }

  get isValid(): boolean {
    return !isEmpty(this.grid && this.grid.selected);
  }

  get canSubmit(): boolean {
    return !isEmpty(this.grid && this.grid.selected);
  }

  get selectedPerson(): IPerson {
    return this.selectedPerson$.value;
  }

  get selectedPersonId(): number {
    return this.selectedPerson && this.selectedPerson.id;
  }

  onSelect(persons: IPerson[]): void {
    this.selectedPerson$.next(this.grid.selected && this.grid.selected[0] as any);
    this.select.emit(this.selectedPerson);
  }

  onEdit(): void {
    this.setDialog('edit');
  }

  onRequest(): void {
    this.fetch();
  }

  onPersonCreated(person: IPerson): void {
    this.closeDialog();
    this.fetch();
  }

  private fetch(): Observable<IPerson[]> {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    const action = this.personSelectService.fetchAll(filters, params);

    action.subscribe((response: IAGridResponse<IPerson>) => {
      this.rows = [ ...response.data ];
      this.rowCount = response.total;
      this.cdRef.markForCheck();
    });

    return action.map(response => response.data);
  }
}
