import { Injectable } from '@angular/core';

@Injectable()
export class PersistenceService {
  static LAYOUT_KEY = 'state/layout';

  get(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      // remove the key if its contents cannot be parsed
      localStorage.removeItem(key);
      return null;
    }
  }

  getOr(key: string, orValue: any): any {
    try {
      const result = JSON.parse(localStorage.getItem(key));
      return result !== null ? result : orValue;
    } catch (error) {
      // remove the key if its contents cannot be parsed
      localStorage.removeItem(key);
      return orValue;
    }
  }

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // TODO(d.maltsev): show notification?
      console.error(error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => !key.startsWith('auth/'))
      .forEach(key => this.remove(key));
  }
}
