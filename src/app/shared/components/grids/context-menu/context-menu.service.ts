import { Injectable } from '@angular/core';

import { IMetadataAction, MetadataActionType } from '@app/core/metadata/metadata.interface';
import { MenuItemDef } from 'ag-grid';
import { IContextMenuOptions, IContextMenuSimpleOptions } from './context-menu.interface';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ContextMenuService {

  constructor(
    private translateService: TranslateService,
  ) { }

  onCtxMenuClick(options?: IContextMenuOptions, simpleOptions?: IContextMenuSimpleOptions): (string | MenuItemDef)[] {
    return [
      ...this.getMetadataMenuItems(options),
      ...this.getSimpleMenuItems(simpleOptions)
    ];
  }

  private getMetadataActions(options: IContextMenuOptions): [ MenuItemDef[], MenuItemDef[]] {
    const actions = (options && options.actions) || [];
    return actions.reduce((acc, action) => {

      const menuDef = action.applyTo ?
      this.getNonSingleAction(action, options) :
      action.children ?
        {
          ...this.getActionWithChildren(action, options),
          subMenu: this.getMetadataMenuItems({
            ...options,
            actions: action.children
          }, true)
        } :
        this.getSingleAction(action, options);
      const arr = (action.applyTo || action.children) ? acc[0] : acc[1];

      arr.push(menuDef);
      return acc;
    }, [[], []] as [ MenuItemDef[], MenuItemDef[] ]);
  }

  private getMetadataMenuItems(
    options: IContextMenuOptions,
    isSubMenu: boolean = false): Array<MenuItemDef | string> {

    return [].concat(
      ...this.getMetadataActions(options)
      .map(mDefs => mDefs.length && !isSubMenu ? [...mDefs, 'separator'] : [...mDefs])
    );
  }

  private getSimpleMenuItems(items: IContextMenuSimpleOptions): Array<MenuItemDef | string> {
    return items.map(action => typeof action === 'string' ? action : ({
        ...action,
        name: this.translateService.instant(action.name),
      })
    );
  }

  private getSingleAction(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateService.instant(`default.grid.actions.${action.action}`),
      action: () => options.cb({
        metadataAction: {
          ...action,
          type: MetadataActionType.SINGLE
        },
        selection: options.selection
      }),
      disabled: action.enabled
        ? !action.enabled.call(null, MetadataActionType.SINGLE, options.selected, options.selection.node.data)
        : false,
    };
  }

  private getActionWithChildren(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateService.instant(`default.grid.actions.${action.action}`),
      disabled: action.enabled
        ? !action.enabled.call(null, MetadataActionType.ALL, options.selected, options.selection.node.data)
        : false,
    };
  }

  private getNonSingleAction(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    const subMenu = [];
    if (action.applyTo.all) {
      subMenu.push(
        this.getActionForAllSubmenu(action, options)
      );
    }
    if (action.applyTo.selected) {
      subMenu.push(
        this.getActionForSelectedSubmenu(action, options)
      );
    }
    return {
      name: this.translateService.instant(`default.grid.actions.${action.action}`),
      subMenu: subMenu.length ? subMenu : undefined
    };
  }

  private getActionForSelectedSubmenu(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateService.instant(`default.grid.actions.actionForSelection`),
      disabled: action.enabled ?
        !action.enabled.call(null, MetadataActionType.SELECTED, options.selected, options.selection.node.data) : false,
      action: () => options.cb({
        metadataAction: {
          ...action,
          type: MetadataActionType.SELECTED
        },
        selection: options.selection
      }),
    };
  }

  private getActionForAllSubmenu(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateService.instant(`default.grid.actions.actionForAll`),
      disabled: action.enabled ? !action.enabled.call(
        null,
        MetadataActionType.ALL,
        options.selected,
        options.selection.node.data) : false,
      action: () => options.cb({
        metadataAction: {
          ...action,
          type: MetadataActionType.ALL
        },
        selection: options.selection
      }),
    };
  }
}
