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

  filterTypes: Array<INotificationType> = [ 'INFO', 'WARNING', 'ERROR', 'DEBUG' ];

  private notificationIconsClasses = {
    DEBUG: 'fa fa-bug text-danger',
    ERROR: 'fa fa-times-circle text-danger',
    WARNING: 'fa fa-warning text-warning',
    INFO: 'fa fa-check-circle text-info',
  };

  constructor(private notificationsActions: NotificationsActions) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  getIconClass(notification: INotification): string {
    return this.notificationIconsClasses[notification.type];
  }

  getTranslationKey(type: INotificationType): string {
    return `notifications.types.${type.toLowerCase()}`;
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
