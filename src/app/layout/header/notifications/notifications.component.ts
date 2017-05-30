import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { INotification, INotificationFilters, INotificationType } from '../../../core/notifications/notifications.interface';

import { NotificationsActions } from '../../../core/notifications/notifications.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  @Input() notifications: Array<INotification>;
  @Input() filters: INotificationFilters;

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  filterTypes: Array<INotificationType> = [ 'DEBUG', 'INFO', 'WARNING', 'ERROR' ];

  constructor(private notificationsActions: NotificationsActions) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  getIconClass(notification: INotification): string {
    switch (notification.type) {
      case 'DEBUG':
        return 'fa fa-2x fa-bug text-danger';
      case 'ERROR':
        return 'fa fa-2x fa-times-circle text-danger';
      case 'WARNING':
        return 'fa fa-2x fa-warning text-warning';
      case 'INFO':
        return 'fa fa-2x fa-check-circle text-info';
    }
  }

  onFilterChange(type: INotificationType, event: MouseEvent): void {
    this.notificationsActions.filter(type, (event.target as HTMLInputElement).checked);
  }

  onClearClick(): void {
    this.notificationsActions.reset();
  }

  onCloseClick(): void {
    this.onClose.emit();
  }
}
