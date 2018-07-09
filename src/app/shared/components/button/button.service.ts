import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig, ButtonConfig, ButtonType } from './button.interface';

@Injectable()
export class ButtonService {
  private items: Map<ButtonType, ButtonConfig> = new Map([
    [ ButtonType.NONE, { iconCls: '', label: '' } ],
    // business btn types
    [ ButtonType.ADD, { iconCls: 'co co-add', label: `default.buttons.${ButtonType.ADD}` } ],
    [ ButtonType.ADD_PROPERTY, { iconCls: 'co co-person-params', label: `default.buttons.${ButtonType.ADD_PROPERTY}` } ],
    [ ButtonType.ADD_USER, { iconCls: 'co co-add-person', label: `default.buttons.${ButtonType.ADD_USER}` } ],
    [ ButtonType.BACK, { iconCls: 'co co-back', label: `default.buttons.${ButtonType.BACK}` } ],
    [ ButtonType.BLOCK, { iconCls: 'co co-lock', label: `default.buttons.${ButtonType.BLOCK}` } ],
    [ ButtonType.CALL, { iconCls: 'co co-call-incoming', label: `default.buttons.${ButtonType.CALL}` } ],
    [ ButtonType.CALL_PAUSE, { iconCls: 'co co-call-pause', label: `default.buttons.${ButtonType.CALL_PAUSE}` } ],
    [ ButtonType.CANCEL, { iconCls: 'co co-close', label: `default.buttons.${ButtonType.CANCEL}` } ],
    [ ButtonType.CHANGE, { iconCls: 'co co-change-status', label: `default.buttons.${ButtonType.CHANGE}` } ],
    [ ButtonType.CHANGE_STATUS, { iconCls: 'co co-change-status', label: `default.buttons.${ButtonType.CHANGE_STATUS}` } ],
    [ ButtonType.CLEAR, { iconCls: 'co co-close', label: `default.buttons.${ButtonType.CLEAR}` } ],
    [ ButtonType.CLOSE, { iconCls: 'co co-close', label: `default.buttons.${ButtonType.CLOSE}` } ],
    [ ButtonType.COPY, { iconCls: 'co co-copy', label: `default.buttons.${ButtonType.COPY}` } ],
    [ ButtonType.DEBT_CARD, { iconCls: 'co co-dialog-info', label: `default.buttons.${ButtonType.DEBT_CARD}`  } ],
    [ ButtonType.DELETE, { iconCls: 'co co-delete', label: `default.buttons.${ButtonType.DELETE}` } ],
    [ ButtonType.DOWNLOAD, { iconCls: 'co co-download', label: `default.buttons.${ButtonType.DOWNLOAD}` } ],
    [ ButtonType.DOWNLOAD_EXCEL, { iconCls: 'co co-download-excel', label: `default.buttons.${ButtonType.DOWNLOAD_EXCEL}` } ],
    [ ButtonType.DROP, { iconCls: 'co co-stop', label: `default.buttons.${ButtonType.DROP}` } ],
    [ ButtonType.EMAIL, { iconCls: 'co co-mail', label: `default.buttons.${ButtonType.EMAIL}` } ],
    [ ButtonType.EDIT, { iconCls: 'co co-edit', label: `default.buttons.${ButtonType.EDIT}` } ],
    [ ButtonType.EXPORT_TO_EXCEL, { iconCls: 'co co-download-excel', label: `default.buttons.${ButtonType.EXPORT_TO_EXCEL}` } ],
    [ ButtonType.FILTER, { iconCls: 'co co-filter', label: `default.buttons.${ButtonType.FILTER}` } ],
    [ ButtonType.INFO, { iconCls: 'co co-dialog-info', label: `default.buttons.${ButtonType.INFO}` } ],
    [ ButtonType.LOAD_FROM_EXCEL, { iconCls: 'co co-upload', label: `default.buttons.${ButtonType.LOAD_FROM_EXCEL}` } ],
    [ ButtonType.MAP, { iconCls: 'co co-image', label: `default.buttons.${ButtonType.MAP}` } ],
    [ ButtonType.MOVE, { iconCls: 'co co-move', label: `default.buttons.${ButtonType.MOVE}` } ],
    [ ButtonType.NEXT, { iconCls: 'co co-back fa-rotate-180', label: `default.buttons.${ButtonType.NEXT}` } ],
    [ ButtonType.OK, { iconCls: 'co co-confirm', label: `default.buttons.${ButtonType.OK}` } ],
    [ ButtonType.PAUSE, { iconCls: 'co co-pause', label: `default.buttons.${ButtonType.PAUSE}` } ],
    [ ButtonType.REFRESH, { iconCls: 'co co-refresh', label: `default.buttons.${ButtonType.REFRESH}` } ],
    [ ButtonType.REGISTER_CONTACT, { iconCls: 'co co-contact-registration',
      label: `default.buttons.${ButtonType.REGISTER_CONTACT}` } ],
    [ ButtonType.RESUME, { iconCls: 'co co-back fa-rotate-180', label: `default.buttons.${ButtonType.RESUME}` } ],
    [ ButtonType.SAVE, { iconCls: 'co co-save', label: `default.buttons.${ButtonType.SAVE}` } ],
    [ ButtonType.SEARCH, { iconCls: 'co co-search', label: `default.buttons.${ButtonType.SEARCH}` } ],
    [ ButtonType.SELECT, { iconCls: 'fa fa-search', label: `default.buttons.${ButtonType.SELECT}` } ],
    [ ButtonType.START, { iconCls: 'co co-start', label: `default.buttons.${ButtonType.START}` } ],
    [ ButtonType.STOP, { iconCls: 'co co-stop', label: `default.buttons.${ButtonType.STOP}` } ],
    [ ButtonType.SMS, { iconCls: 'co co-sms', label: `default.buttons.${ButtonType.SMS}` } ],
    [ ButtonType.TRANSFER, { iconCls: 'co co-call-transfer', label: `default.buttons.${ButtonType.TRANSFER}` } ],
    [ ButtonType.UNBLOCK, { iconCls: 'co co-unlock', label: `default.buttons.${ButtonType.UNBLOCK}` } ],
    [ ButtonType.UNDO, { iconCls: 'co co-undo', label: `default.buttons.${ButtonType.UNDO}` } ],
    [ ButtonType.UPLOAD, { iconCls: 'co co-upload', label: `default.buttons.${ButtonType.UPLOAD}` } ],
    [ ButtonType.VERSION, { iconCls: 'co co-version-history', label: `default.buttons.${ButtonType.VERSION}` } ],
    [ ButtonType.VISIT, { iconCls: 'co co-visit', label: `default.buttons.${ButtonType.VISIT}` } ],
  ]);


  private readonly styles: IButtonStylesConfig = {
    none: 'btn-link ph0',
    default: 'btn-default',
    primary: 'btn-success',
    secondary: 'btn-primary',
    warning: 'btn-warning',
    danger: 'btn-danger',
  };

  getIcon(type: ButtonType = ButtonType.NONE): string {
    return this.items.get(type).iconCls;
  }

  getLabel(type: ButtonType = ButtonType.NONE): string {
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
