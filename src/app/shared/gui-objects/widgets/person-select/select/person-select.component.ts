import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ViewChild, Input
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson, PersonSelectorComponent, ISelectedPerson } from '../person-select.interface';

import { PersonSelectGridComponent } from '../grid/person-select-grid.component';
import { PersonSelectCardComponent } from '../card/person-select-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select',
  templateUrl: './person-select.component.html'
})
export class PersonSelectComponent implements AfterViewInit {

  @Input() person: IPerson;

  @ViewChild(PersonSelectGridComponent) grid: PersonSelectGridComponent;
  @ViewChild(PersonSelectCardComponent) card: PersonSelectCardComponent;

  private personSelectComponent: PersonSelectorComponent;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.personSelectComponent = this.person ? this.card : this.grid;
  }

  get personSelectComponents(): PersonSelectorComponent[] {
    return [ this.grid, this.card ];
  }

  get canSubmit(): boolean {
    return this.personSelectComponent && this.personSelectComponent.isValid;
  }

  getSelectedPerson(): Observable<ISelectedPerson> {
    return this.personSelectComponent && this.personSelectComponent.getSelectedPerson();
  }

  onTabSelect(tabIndex: number): void {
    this.personSelectComponent = this.personSelectComponents[tabIndex];
    this.cdRef.markForCheck();
  }
}
