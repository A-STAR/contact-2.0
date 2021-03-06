import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IButtonStyle, ButtonType } from './button.interface';

import { ButtonService } from './button.service';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.components.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() color: IButtonStyle = 'default';
  @Input() disabled: boolean;
  @Input() icon: string;
  @Input() label: string | false;
  @Input() title: string;
  @Input() type: ButtonType;
  // TODO(i.lobanov): remove it when btn service is refactored
  @Input() btnClass: string;
  @Input() hasIcon = false;
  @Input() withBtnClass = true;

  constructor(private buttonService: ButtonService) {}

  get buttonClass(): string {
    return (this.btnClass ? this.btnClass + ' ' : '')
      + this.buttonService.getClass(this.color, this.withBtnClass);
  }

  get iconClass(): string {
    return this.hasIcon ? (this.icon || this.buttonService.getIcon(this.type)) : null;
  }

  get displayLabel(): string {
    return this.label === false ? null : (this.label || this.buttonService.getLabel(this.type));
  }

  get displayTitle(): string {
    return this.title || this.label || this.buttonService.getLabel(this.type);
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      event.stopPropagation();
    }
  }
}
