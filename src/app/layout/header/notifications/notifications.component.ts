import { Component } from '@angular/core';

import { INotification } from '../../../core/notifications/notifications.interface';

import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})

export class NotificationsComponent {

  notifications: Array<INotification>;

  constructor(private notificationsService: NotificationsService) {
    // TODO: unsubscribe
    this.notificationsService.notifications.subscribe((notifications: Array<INotification>) => this.notifications = notifications);
  }
}
