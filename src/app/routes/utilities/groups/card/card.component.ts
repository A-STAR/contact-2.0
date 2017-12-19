import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-tab',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupCardComponent {
  static COMPONENT_NAME = 'GroupCardComponent';

  constructor(
    private route: ActivatedRoute,
  ) {}

  get groupId(): number {
    return Number(this.route.snapshot.paramMap.get('groupId'));
  }
}
