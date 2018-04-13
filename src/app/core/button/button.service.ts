import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig, IButtonType, IButtonTypesConfig } from './button.interface';

@Injectable()
export class ButtonService {
  private defaultIcons: IButtonTypesConfig = {
    add:              { icon: 'co co-add',                  label: 'default.buttons.add'              },
    addUser:          { icon: 'co co-add',                  label: 'default.buttons.addUser'          },
    back:             { icon: 'co co-back',                 label: 'default.buttons.back'             },
    block:            { icon: 'co co-lock',                 label: 'default.buttons.block'            },
    call:             { icon: 'co co-call-incoming',        label: 'default.buttons.call'             },
    callPause:        { icon: 'co co-call-pause',           label: 'default.buttons.callPause'        },
    cancel:           { icon: 'co co-cancel',               label: 'default.buttons.cancel'           },
    change:           { icon: '',                           label: 'default.buttons.change'           }, // exchange-alt
    changeStatus:     { icon: 'co co-change-status',        label: 'default.buttons.changeStatus'     },
    clear:            { icon: 'co co-close',                label: 'default.buttons.clear'            },
    close:            { icon: 'co co-close',                label: 'default.buttons.close'            },
    copy:             { icon: 'co co-copy',                 label: 'default.buttons.copy'             },
    debtCard:         { icon: 'co co-debt-list',            label: 'default.buttons.debtCard'         },
    delete:           { icon: 'co co-delete',               label: 'default.buttons.delete'           },
    download:         { icon: 'co co-download',             label: 'default.buttons.download'         },
    drop:             { icon: 'co co-stop',                 label: 'default.buttons.drop'             },
    email:            { icon: 'co co-mail',                 label: 'default.buttons.email'            },
    edit:             { icon: 'co co-edit',                 label: 'default.buttons.edit'             },
    exportToExcel:    { icon: 'co co-download-excel',       label: 'default.buttons.exportToExcel'    },
    filter:           { icon: 'co co-filter',               label: 'default.buttons.filter'           },
    info:             { icon: 'co co-info-o',               label: 'default.buttons.info'             },
    loadFromExcel:    { icon: 'co co-data-upload',          label: 'default.buttons.loadFromExcel'    },
    move:             { icon: 'co co-move',                 label: 'default.buttons.move'             },
    next:             { icon: 'co co-back fa-rotate-180',   label: 'default.buttons.next'             },
    ok:               { icon: 'co co-confirm',              label: 'default.buttons.ok'               },
    pause:            { icon: 'co co-pause',                label: 'default.buttons.pause'            },
    refresh:          { icon: 'co co-refresh',              label: 'default.buttons.refresh'          },
    registerContact:  { icon: 'co co-contact-registration', label: 'default.buttons.registerContact'  },
    resume:           { icon: 'co co-back fa-rotate-180',   label: 'default.buttons.resume'           },
    save:             { icon: 'co co-save',                 label: 'default.buttons.save'             },
    search:           { icon: 'co co-search',               label: 'default.buttons.search'           },
    select:           { icon: 'fa fa-crosshairs',           label: 'default.buttons.select'           }, // crosshairs
    start:            { icon: 'co co-start',                label: 'default.buttons.start'            },
    stop:             { icon: 'co co-stop',                 label: 'default.buttons.stop'             },
    sms:              { icon: 'co co-sms',                  label: 'default.buttons.sms'              },
    transfer:         { icon: 'co co-call-transfer',        label: 'default.buttons.transfer'         },
    unblock:          { icon: 'co co-unlock',               label: 'default.buttons.unblock'          },
    undo:             { icon: 'co co-undo',                 label: 'default.buttons.undo'             },
    upload:           { icon: 'co co-data-upload',          label: 'default.buttons.upload'           },
    version:          { icon: 'co co-version-history',      label: 'default.buttons.version'          },
    visit:            { icon: 'co co-visit',                label: 'default.buttons.visit'            },
  };

  private styles: IButtonStylesConfig = {
    none: 'btn-link',
    default: 'btn-default',
    primary: 'btn-success',
    secondary: 'btn-primary',
    warning: 'btn-warning',
    danger: 'btn-danger',
  };

  getIcon(type: IButtonType): string {
    return this.defaultIcons[type] ? this.defaultIcons[type].icon : null;
  }

  getLabel(type: IButtonType): string {
    return this.defaultIcons[type] ? this.defaultIcons[type].label : null;
  }

  getClass(style: IButtonStyle): string {
    return this.styles[style];
  }
}
