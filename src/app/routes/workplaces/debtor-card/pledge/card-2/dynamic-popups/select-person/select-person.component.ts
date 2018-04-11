import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { SelectPersonService } from './select-person.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person',
  templateUrl: 'select-person.component.html'
})
export class SelectPersonComponent implements OnInit {
  readonly columns: ISimpleGridColumn<any>[] = [
    { label: 'ID', prop: 'id' },
    { label: 'Фамилия', prop: 'lastName' },
    { label: 'Имя', prop: 'firstName' },
    { label: 'Отчество', prop: 'middleName' },
    { label: 'Тип должника', prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { label: 'Дата рождения', prop: 'birthDate', renderer: DateRendererComponent },
    { label: 'Пол', prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { label: 'Серия и номер паспорта', prop: 'passportNumber' },
    ...range(1, 10).map(i => ({ label: `Строковый атрибут ${i}`, prop: `stringValue${i}` })),
  ];

  private _rows = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private selectPersonService: SelectPersonService,
  ) {}

  get rows(): any[] {
    return this._rows;
  }

  ngOnInit(): void {
    this.selectPersonService
      .search()
      .subscribe(rows => {
        this._rows = rows;
        this.cdRef.markForCheck();
      });
  }
}
