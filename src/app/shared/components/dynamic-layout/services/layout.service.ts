import { Injectable } from '@angular/core';

import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutGroup,
} from '../interface';

import { MetadataService } from './metadata.service';

@Injectable()
export class LayoutService {
  private config: IDynamicLayoutConfig;

  constructor(
    private metadataService: MetadataService,
  ) {}

  get initialized(): boolean {
    return Boolean(this.config);
  }

  get group(): IDynamicLayoutGroup {
    return {
      children: this.config.items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
  }

  set layout(layout: string | IDynamicLayoutConfig) {
    if (typeof layout === 'string') {
      this.metadataService
        .getConfig(layout)
        .subscribe(config => this.init(config));
    } else {
      this.init(layout);
    }
  }

  private init(config: IDynamicLayoutConfig): void {
    this.config = config;
  }
}
