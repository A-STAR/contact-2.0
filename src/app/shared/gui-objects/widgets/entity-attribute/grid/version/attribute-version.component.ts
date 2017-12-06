import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttributeVersion } from '../../attribute.interface';

import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { makeKey } from '../../../../../../core/utils';
import { DialogFunctions } from '../../../../../../core/dialog';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-version',
  templateUrl: './attribute-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeVersionComponent implements OnInit {
  @Input() selectedAttributeId: number;
  @Input() entityTypeId: number;

  selectedVersion$ = new BehaviorSubject<IAttributeVersion>(null);
  rows: IAttributeVersion[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService
  ) {}

  onRowSelect(attribute: IAttributeVersion): void {
    this.selectedVersion$.next(attribute);
  }

  ngOnInit(): void {
    this.entitySubscription = this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', this.entityTypeId)
      .subscribe((canView) => {

        if (canView && this.entityTypeId && this.selectedAttributeId) {
          this.fetch();
        } else {
          this.rows = [];
          this.cdRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.entitySubscription.unsubscribe();
  }

  get columns(): Array<IGridTreeColumn<IAttributeVersion>> {
    return this._columns;
  }

  get selectedAttributeCode$(): Observable<number> {
    return this.selectedVersion$.map(attribute => attribute.code);
  }

  onRowDblClick(attribute: IAttribute): void {
    this.selectedVersion$.next(attribute);
    this.canEdit$
      .pipe(first())
      .filter(Boolean)
      .subscribe(() => {
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  private fetch(): void {
    this.attributeService.fetchAll(this.entityTypeId, this.entityId).subscribe(attributes => {
      this.rows = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }

}
