import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { PersonTypeService } from './person-type.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-mass-person-type',
  templateUrl: './person-type.component.html',
  styleUrls: ['./person-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonTypeComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedPersonType: IUserTerm;

  columns: ISimpleGridColumn<IUserTerm>[] = [
    { prop: 'code' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.mass.changePersonType.grid'));

  personTypes: IUserTerm[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private personTypeService: PersonTypeService,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_PERSON_TYPE)
      .pipe(first())
      .subscribe(personTypes => {
        this.personTypes = personTypes;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.personTypeService
      .change(this.actionData.payload, this.selectedPersonType.code)
      .subscribe(() => {
        this.close.emit({ refresh: false });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedPersonType;
  }

  onSelect(personTypes: IUserTerm[]): void {
    this.selectedPersonType = personTypes[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
