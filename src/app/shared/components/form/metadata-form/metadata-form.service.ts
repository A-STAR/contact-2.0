import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  IMetadataFormEvent,
  IMetadataFormEventType,
  IMetadataFormGridSelectControl,
  IMetadataFormPlugin,
  IMetadataFormPluginType,
} from './metadata-form.interface';

import { AbstractPlugin } from './plugins/abstract';
import { LinkGridSelectPlugin } from './plugins/link-gridselect';

@Injectable()
export class MetadataFormService {
  private plugins: AbstractPlugin[];

  setPlugins(formGroup: FormGroup, plugins: IMetadataFormPlugin[]): void {
    this.plugins = plugins.map(p => {
      switch (p.type) {
        case IMetadataFormPluginType.LINK_GRIDSELECT:
          return new LinkGridSelectPlugin(formGroup, p);
        default:
          throw new Error('Incorrect plugin name');
      }
    });
  }

  onGridSelect(control: IMetadataFormGridSelectControl, row: any): void {
    this.emitPluginEvent({ type: IMetadataFormEventType.GRIDSELECT, control, row });
  }

  private emitPluginEvent(event: IMetadataFormEvent): void {
    this.plugins.forEach(p => p.handle(event));
  }
}
