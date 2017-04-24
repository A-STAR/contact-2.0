import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MenuItem } from './menu-item.interface';

@Injectable()
export class MenuService {
  private menuItems: Array<MenuItem> = [];

  constructor(private http: Http) {
    this.menuItems = [];
  }

  loadMenu() {
    return this.http
      .get('assets/server/menu.json')
      .toPromise()
      .then(response => response.json())
      .then(data => this.menuItems = data.menu)
      .catch(error => {
        // TODO
        console.error('Could not load menu.', error);
      })
  }

  getMenu() {
    return this.menuItems;
  }
}
