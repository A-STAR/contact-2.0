import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig, ButtonConfig, ButtonType } from './button.interface';

@Injectable()
export class ButtonService {
  private items: Map<ButtonType, ButtonConfig> = new Map([
    [ ButtonType.ADD, { iconsCls: 'co co-add', label: `default.buttons.${ButtonType.ADD}` } ],
    [ ButtonType.ADD_PROPERTY, { iconsCls: 'co co-person-params', label: `default.buttons.${ButtonType.ADD_PROPERTY}` } ],
    [ ButtonType.ADD_USER, { iconsCls: 'co co-add-person', label: `default.buttons.${ButtonType.ADD_USER}` } ],
    [ ButtonType.BACK, { iconsCls: 'co co-back', label: `default.buttons.${ButtonType.BACK}` } ],
    [ ButtonType.BLOCK, { iconsCls: 'co co-lock', label: `default.buttons.${ButtonType.BLOCK}` } ],
    [ ButtonType.CALL, { iconsCls: 'co co-call-incoming', label: `default.buttons.${ButtonType.CALL}` } ],
    [ ButtonType.CALL_PAUSE, { iconsCls: 'co co-call-pause', label: `default.buttons.${ButtonType.CALL_PAUSE}` } ],
    [ ButtonType.CANCEL, { iconsCls: 'co co-close', label: `default.buttons.${ButtonType.CANCEL}` } ],
    [ ButtonType.CHANGE, { iconsCls: 'co co-change-status', label: `default.buttons.${ButtonType.CHANGE}` } ],
    [ ButtonType.CHANGE_STATUS, { iconsCls: 'co co-change-status', label: `default.buttons.${ButtonType.CHANGE_STATUS}` } ],
    [ ButtonType.CLEAR, { iconsCls: 'co co-close', label: `default.buttons.${ButtonType.CLEAR}` } ],
    [ ButtonType.CLOSE, { iconsCls: 'co co-close', label: `default.buttons.${ButtonType.CLOSE}` } ],
    [ ButtonType.COPY, { iconsCls: 'co co-copy', label: `default.buttons.${ButtonType.COPY}` } ],
    [ ButtonType.DEBT_CARD, { iconsCls: 'co co-dialog-info', label: `default.buttons.${ButtonType.DEBT_CARD}`  } ],
    [ ButtonType.DELETE, { iconsCls: 'co co-delete', label: `default.buttons.${ButtonType.DELETE}` } ],
    [ ButtonType.DOWNLOAD, { iconsCls: 'co co-download', label: `default.buttons.${ButtonType.DOWNLOAD}` } ],
    [ ButtonType.DOWNLOAD_EXCEL, { iconsCls: 'co co-download-excel', label: `default.buttons.${ButtonType.DOWNLOAD_EXCEL}` } ],
    [ ButtonType.DROP, { iconsCls: 'co co-stop', label: `default.buttons.${ButtonType.DROP}` } ],
    [ ButtonType.EMAIL, { iconsCls: 'co co-mail', label: `default.buttons.${ButtonType.EMAIL}` } ],
    [ ButtonType.EDIT, { iconsCls: 'co co-edit', label: `default.buttons.${ButtonType.EDIT}` } ],
    [ ButtonType.EXPORT_TO_EXCEL, { iconsCls: 'co co-download-excel', label: `default.buttons.${ButtonType.EXPORT_TO_EXCEL}` } ],
    [ ButtonType.FILTER, { iconsCls: 'co co-filter', label: `default.buttons.${ButtonType.FILTER}` } ],
    [ ButtonType.INFO, { iconsCls: 'co co-dialog-info', label: `default.buttons.${ButtonType.INFO}` } ],
    [ ButtonType.LOAD_FROM_EXCEL, { iconsCls: 'co co-upload', label: `default.buttons.${ButtonType.LOAD_FROM_EXCEL}` } ],
    [ ButtonType.MAP, { iconsCls: 'co co-image', label: `default.buttons.${ButtonType.MAP}` } ],
    [ ButtonType.MOVE, { iconsCls: 'co co-move', label: `default.buttons.${ButtonType.MOVE}` } ],
    [ ButtonType.NEXT, { iconsCls: 'co co-back fa-rotate-180', label: `default.buttons.${ButtonType.NEXT}` } ],
    [ ButtonType.OK, { iconsCls: 'co co-confirm', label: `default.buttons.${ButtonType.OK}` } ],
    [ ButtonType.PAUSE, { iconsCls: 'co co-pause', label: `default.buttons.${ButtonType.PAUSE}` } ],
    [ ButtonType.REFRESH, { iconsCls: 'co co-refresh', label: `default.buttons.${ButtonType.REFRESH}` } ],
    [ ButtonType.REGISTER_CONTACT, { iconsCls: 'co co-contact-registration',
      label: `default.buttons.${ButtonType.REGISTER_CONTACT}` } ],
    [ ButtonType.RESUME, { iconsCls: 'co co-back fa-rotate-180', label: `default.buttons.${ButtonType.RESUME}` } ],
    [ ButtonType.SAVE, { iconsCls: 'co co-save', label: `default.buttons.${ButtonType.SAVE}` } ],
    [ ButtonType.SEARCH, { iconsCls: 'co co-search', label: `default.buttons.${ButtonType.SEARCH}` } ],
    [ ButtonType.SELECT, { iconsCls: 'fa fa-search', label: `default.buttons.${ButtonType.SELECT}` } ],
    [ ButtonType.START, { iconsCls: 'co co-start', label: `default.buttons.${ButtonType.START}` } ],
    [ ButtonType.STOP, { iconsCls: 'co co-stop', label: `default.buttons.${ButtonType.STOP}` } ],
    [ ButtonType.SMS, { iconsCls: 'co co-sms', label: `default.buttons.${ButtonType.SMS}` } ],
    [ ButtonType.TRANSFER, { iconsCls: 'co co-call-transfer', label: `default.buttons.${ButtonType.TRANSFER}` } ],
    [ ButtonType.UNBLOCK, { iconsCls: 'co co-unlock', label: `default.buttons.${ButtonType.UNBLOCK}` } ],
    [ ButtonType.UNDO, { iconsCls: 'co co-undo', label: `default.buttons.${ButtonType.UNDO}` } ],
    [ ButtonType.UPLOAD, { iconsCls: 'co co-upload', label: `default.buttons.${ButtonType.UPLOAD}` } ],
    [ ButtonType.VERSION, { iconsCls: 'co co-version-history', label: `default.buttons.${ButtonType.VERSION}` } ],
    [ ButtonType.VISIT, { iconsCls: 'co co-visit', label: `default.buttons.${ButtonType.VISIT}` } ],
  ]);


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

  // private generateConfig(): any[] {
  //   return Object.keys(ButtonType).map(k => ([
  //       ButtonType[k],
  //       { iconCls: this.generateIconCls(ButtonType[k]), label: `default.buttons.${ButtonType[k]}` }
  //     ])
  //   );
  // }

  // private generateIconCls(name: string): string {
  //   return `co co-${name.replace(/([A-Z])/g, m => '-' + m.toLowerCase())}`;
  // }
}
