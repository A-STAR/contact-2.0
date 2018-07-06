import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig, ButtonConfig, ButtonType } from './button.interface';

@Injectable()
export class ButtonService {
  private items: Map<ButtonType, ButtonConfig>;

  constructor() {
    this.items = new Map(...this.generateConfig());
  }

  private readonly styles: IButtonStylesConfig = {
    none: 'btn-link ph0',
    default: 'btn-default',
    primary: 'btn-success',
    secondary: 'btn-primary',
    warning: 'btn-warning',
    danger: 'btn-danger',
  };

  getIcon(type: ButtonType): string {
    return this.items.get(type).iconCls;
  }

  getLabel(type: ButtonType): string {
    return this.items.get(type).label;
  }

  getClass(style: IButtonStyle, withBtnClass: boolean = true): string {
    return (withBtnClass ? 'btn ' : '') + this.styles[style];
  }

  private generateConfig(): any[] {
    return Object.keys(ButtonType).map(k => ([
        ButtonType[k],
        { iconCls: this.generateIconCls(ButtonType[k]), label: `default.buttons.${ButtonType[k]}` }
      ])
    );
  }

  private generateIconCls(name: string): string {
    return `co co-${name.replace(/([A-Z])/g, m => '-' + m.toLowerCase())}`;
  }
}
