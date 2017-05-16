import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../users.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})

export class UserEditComponent {
  @Input() user: IUser;
  @Output() userChange: EventEmitter<IUser> = new EventEmitter();

  error: string = null;

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
