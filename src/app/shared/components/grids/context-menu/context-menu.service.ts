import { Injectable } from '@angular/core';

import { IMetadataAction, MetadataActionType } from '@app/core/metadata/metadata.interface';
import { MenuItemDef } from 'ag-grid';
import { IContextMenuOptions, IContextMenuSimpleOptions, IContextMenuParams } from './context-menu.interface';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ContextMenuService {

  constructor(
    private translate: TranslateService,
  ) { }

  translateNameAndShortcut(key: string, defaultValue: string): string {
    const translationPath = 'default.grid.localeText';
    const translationKey = `${translationPath}.${key}`;

    const translation = this.translate.instant(translationKey);

    const hasTranslation = translation !== translationKey;

    /**
     * default value for shortcuts or name if no translations
     *
     * for example 'Ctrl+C', 'separator'
     */

    return hasTranslation ? translation : defaultValue;
  }

  onCtxMenuClick(options?: IContextMenuOptions, simpleOptions?: IContextMenuSimpleOptions): (string | MenuItemDef)[] {
    return options.selection.node ? [
      ...this.getMetadataMenuItems(options),
      ...this.getSimpleMenuItems(simpleOptions)
    ] : [];
  }

  private getMetadataActions(options: IContextMenuOptions): [ MenuItemDef[], MenuItemDef[]] {
    const actions = (options && options.actions) || [];
    return actions
      .reduce((acc, action) => {
        const menuDef = action.applyTo
          ? this.getNonSingleAction(action, options)
          : action.children
            ? {
              ...this.getActionWithChildren(action, options),
              subMenu: this.getMetadataMenuItems({
                ...options,
                actions: action.children
              }, true)
            }
            : this.getSingleAction(action, options);
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
        name: this.translate.instant(action.name),
      })
    );
  }

  private getSingleAction(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateAction(action),
      action: () => options.cb({
        metadataAction: {
          ...action,
          type: MetadataActionType.SINGLE
        },
        selection: options.selection
      }),
      disabled: action.enabled
        ? !action.enabled.call(null, this.setPermParams(action, MetadataActionType.SINGLE, options))
        : false,
    };
  }

  private getActionWithChildren(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translateAction(action),
      disabled: action.enabled
        ? !action.enabled.call(null, this.setPermParams(action, MetadataActionType.ALL, options))
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
      name: this.translateAction(action),
      subMenu: subMenu.length ? subMenu : undefined
    };
  }

  private getActionForSelectedSubmenu(action: IMetadataAction, options: IContextMenuOptions): MenuItemDef {
    return {
      name: this.translate.instant(`default.grid.actions.actionForSelection`),
      disabled: action.enabled ?
        !action.enabled.call(null, this.setPermParams(action, MetadataActionType.SELECTED, options)) : false,
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
      name: this.translate.instant(`default.grid.actions.actionForAll`),
      disabled: action.enabled ? !action.enabled.call(
        null,
        this.setPermParams(action, MetadataActionType.ALL, options)
        ) : false,
      action: () => options.cb({
        metadataAction: {
          ...action,
          type: MetadataActionType.ALL
        },
        selection: options.selection
      }),
    };
  }

  private translateAction(action: IMetadataAction): string {
    const translationKey = `${action.label || 'default.grid.actions'}.${action.action}`;
    const translation = this.translate.instant(translationKey);
    return translation !== translationKey ? translation : action.action;
  }

  private setPermParams(action: IMetadataAction, type: MetadataActionType, options: IContextMenuOptions): IContextMenuParams {
    return {
      action: {
        ...action,
        type
      },
      selected: options.selected,
      selection: options.selection.node.data
    };
  }
}
