import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-tab',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupEditComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get groupId(): number {
    return Number(this.route.snapshot.paramMap.get('groupId'));
  }
}
