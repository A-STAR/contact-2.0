import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {

  groupId: number;

  constructor(private cdRef: ChangeDetectorRef) {}

  onGroupSelect(groupId: number): void {
    this.groupId = groupId;
    this.cdRef.markForCheck();
  }
}
