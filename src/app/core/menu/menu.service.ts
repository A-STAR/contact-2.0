import { Injectable } from '@angular/core';

import { MenuItem } from './menu-item.interface';

@Injectable()
export class MenuService {

    menuItems: Array<MenuItem>;

    constructor() {
        this.menuItems = [];
    }

    addMenu(items: Array<MenuItem>) {
        this.menuItems = this.menuItems.concat(items);
    }

    getMenu() {
        return this.menuItems;
    }

}
