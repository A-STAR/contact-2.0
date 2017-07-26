import { Injectable } from '@angular/core';

@Injectable()
export class PersistenceService {
  get(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return null;
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
