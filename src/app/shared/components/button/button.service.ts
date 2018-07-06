import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig } from './button.interface';
import { IconType, IconsConfig } from '@app/shared/components/icons/icons.interface';
import { IconsService } from '@app/shared/components/icons/icons.service';

@Injectable()
export class ButtonService {
  constructor(
    private iconsService: IconsService
  ) {}

  private readonly labels: IconsConfig = {
    add:              'default.buttons.add',
    addProperty:      'default.buttons.addProperty',
    addUser:          'default.buttons.addUser',
    back:             'default.buttons.back',
    block:            'default.buttons.block',
    call:             'default.buttons.call',
    callPause:        'default.buttons.callPause',
    cancel:           'default.buttons.cancel',
    change:           'default.buttons.change', // exchange-alt
    changeStatus:     'default.buttons.changeStatus',
    clear:            'default.buttons.clear',
    close:            'default.buttons.close',
    copy:             'default.buttons.copy',
    debtCard:         'default.buttons.debtCard',
    delete:           'default.buttons.delete',
    download:         'default.buttons.download',
    drop:             'default.buttons.drop',
    email:            'default.buttons.email',
    edit:             'default.buttons.edit',
    exportToExcel:    'default.buttons.exportToExcel',
    filter:           'default.buttons.filter',
    info:             'default.buttons.info',
    loadFromExcel:    'default.buttons.loadFromExcel',
    map:              'default.buttons.map',
    move:             'default.buttons.move',
    next:             'default.buttons.next',
    ok:               'default.buttons.ok',
    pause:            'default.buttons.pause',
    refresh:          'default.buttons.refresh',
    registerContact:  'default.buttons.registerContact',
    resume:           'default.buttons.resume',
    save:             'default.buttons.save',
    search:           'default.buttons.search',
    select:           'default.buttons.select', // crosshairs
    start:            'default.buttons.start',
    stop:             'default.buttons.stop',
    sms:              'default.buttons.sms',
    transfer:         'default.buttons.transfer',
    unblock:          'default.buttons.unblock',
    undo:             'default.buttons.undo',
    upload:           'default.buttons.upload',
    version:          'default.buttons.version',
    visit:            'default.buttons.visit',
  };

  private readonly styles: IButtonStylesConfig = {
    none: 'btn-link ph0',
    default: 'btn-default',
    primary: 'btn-success',
    secondary: 'btn-primary',
    warning: 'btn-warning',
    danger: 'btn-danger',
  };

  getIcon(type: IconType): string {
    return this.iconsService.get(type);
  }

  getLabel(type: IconType): string {
    return this.labels[type];
  }

  getClass(style: IButtonStyle, withBtnClass: boolean = true): string {
    return (withBtnClass ? 'btn ' : '') + this.styles[style];
  }
}
