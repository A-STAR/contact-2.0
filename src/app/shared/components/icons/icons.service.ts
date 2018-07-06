import { Injectable } from '@angular/core';

import { IconType, IconsConfig } from './icons.interface';

@Injectable()
export class IconsService {

  private readonly icons: IconsConfig = {
    add:              'co co-add',
    addProperty:      'co co-person-params',
    addUser:          'co co-add-person',
    back:             'co co-back',
    block:            'co co-lock',
    call:             'co co-call-incoming',
    callPause:        'co co-call-pause',
    cancel:           'co co-close',
    change:           'co co-change-status', // exchange-alt
    changeStatus:     'co co-change-status',
    clear:            'co co-close',
    close:            'co co-close',
    copy:             'co co-copy',
    debtCard:         'co co-dialog-info',
    delete:           'co co-delete',
    download:         'co co-download',
    drop:             'co co-stop',
    email:            'co co-mail',
    edit:             'co co-edit',
    exportToExcel:    'co co-download-excel',
    filter:           'co co-filter',
    info:             'co co-dialog-info',
    loadFromExcel:    'co co-upload',
    map:              'co co-image',
    move:             'co co-move',
    next:             'co co-back fa-rotate-180',
    ok:               'co co-confirm',
    pause:            'co co-pause',
    refresh:          'co co-refresh',
    registerContact:  'co co-contact-registration',
    resume:           'co co-back fa-rotate-180',
    save:             'co co-save',
    search:           'co co-search',
    select:           'fa fa-search', // crosshairs
    start:            'co co-start',
    stop:             'co co-stop',
    sms:              'co co-sms',
    transfer:         'co co-call-transfer',
    unblock:          'co co-unlock',
    undo:             'co co-undo',
    upload:           'co co-upload',
    version:          'co co-version-history',
    visit:            'co co-visit',
  };

  constructor() { }

  get(type: IconType): string {
    return this.icons[type];
  }

}
