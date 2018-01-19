import { Injectable } from '@angular/core';

import { IButtonStyle, IButtonStylesConfig, IButtonType, IButtonTypesConfig } from './button.interface';

@Injectable()
export class ButtonService {
  private defaultIcons: IButtonTypesConfig = {
    add:              { icon: 'fa fa-plus',             label: 'default.buttons.add'              },
    addUser:          { icon: 'fa fa-user-plus',        label: 'default.buttons.addUser'          },
    back:             { icon: 'fa fa-arrow-left',       label: 'default.buttons.back'             },
    block:            { icon: 'fa fa-unlock-alt',       label: 'default.buttons.block'            },
    cancel:           { icon: 'fa fa-ban',              label: 'default.buttons.cancel'           },
    change:           { icon: '',                       label: 'default.buttons.change'           },
    changeStatus:     { icon: 'fa fa-random',           label: 'default.buttons.changeStatus'     },
    clear:            { icon: 'fa fa-times',            label: 'default.buttons.clear'            },
    close:            { icon: 'fa fa-remove',           label: 'default.buttons.close'            },
    copy:             { icon: 'fa fa-clone',            label: 'default.buttons.copy'             },
    delete:           { icon: 'fa fa-trash',            label: 'default.buttons.delete'           },
    download:         { icon: 'fa fa-cloud-download',   label: 'default.buttons.download'         },
    email:            { icon: 'fa fa-envelope',         label: 'default.buttons.email'            },
    edit:             { icon: 'fa fa-pencil',           label: 'default.buttons.edit'             },
    exportToExcel:    { icon: 'fa fa-file-excel-o',     label: 'default.buttons.exportToExcel'    },
    move:             { icon: 'fa fa-share',            label: 'default.buttons.move'             },
    next:             { icon: 'fa fa-arrow-right',      label: 'default.buttons.next'             },
    ok:               { icon: 'fa fa-check',            label: 'default.buttons.ok'               },
    refresh:          { icon: 'fa fa-refresh',          label: 'default.buttons.refresh'          },
    registerContact:  { icon: 'fa fa-tty',              label: 'default.buttons.registerContact'  },
    save:             { icon: 'fa fa-save',             label: 'default.buttons.save'             },
    search:           { icon: 'fa fa-search',           label: 'default.buttons.search'           },
    select:           { icon: '',                       label: 'default.buttons.select'           },
    start:            { icon: 'fa fa-play',             label: 'default.buttons.start'            },
    stop:             { icon: 'fa fa-stop',             label: 'default.buttons.stop'             },
    sms:              { icon: 'fa fa-envelope',         label: 'default.buttons.sms'              },
    unblock:          { icon: 'fa fa-unlock',           label: 'default.buttons.unblock'          },
    undo:             { icon: 'fa fa-undo',             label: 'default.buttons.undo'             },
    upload:           { icon: 'fa fa-cloud-upload',     label: 'default.buttons.upload'           },
    version:          { icon: 'fa fa-code-fork',        label: 'default.buttons.version'          },
    visit:            { icon: 'fa fa-bus',              label: 'default.buttons.visit'            },
  };

  private styles: IButtonStylesConfig = {
    none: 'btn btn-link',
    default: 'btn btn-default',
    primary: 'btn btn-success',
    secondary: 'btn btn-primary',
    warning: 'btn btn-warning',
    danger: 'btn btn-danger',
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
