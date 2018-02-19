import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IButtonStyle, IButtonType } from '@app/core/button/button.interface';

import { ButtonService } from '@app/core/button/button.service';

@Component({
  selector: 'app-button2',
  styleUrls: [ './button.component.scss' ],
  templateUrl: 'button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() color: IButtonStyle = 'default';
  @Input() disabled: boolean;
  @Input() icon: string;
  @Input() label: string | false;
  @Input() title: string;
  @Input() type: IButtonType;

  constructor(private buttonService: ButtonService) {}

  get buttonClass(): string {
    return this.buttonService.getClass(this.color);
  }

  get iconClass(): string {
    return this.icon || this.buttonService.getIcon(this.type);
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
