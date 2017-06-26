import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-restricted-view',
  templateUrl: './restricted-view.component.html',
  styleUrls: [ './restricted-view.component.scss' ]
})
export class RestrictedViewComponent implements OnInit, OnDestroy {
  @Input() canView: Observable<boolean>;
  @Input() message: string;

  private subscription: Subscription;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.subscription = this.canView
      .distinctUntilChanged()
      .subscribe(canView => {
        if (canView === false) {
          this.notificationsService.error(this.message, true);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
