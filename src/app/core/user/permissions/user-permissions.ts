import { IUserPermissions } from './user-permissions.interface';

export class UserPermissions {
  static CUSTOM_PERMISSION_THRESHOLD = 20000;

  constructor(private permissions: IUserPermissions) {}

  has(name: string): boolean {
    return this.getBooleanValue(name);
  }

  hasOneOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc || this.getBooleanValue(name), false);
  }

  hasAllOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc && this.getBooleanValue(name), true);
  }

  contains(name: string, value: number): boolean {
    return this.stringValueContainsAll(name) || this.stringValueContainsNumber(name, value);
  }

  containsOneOf(name: string, values: Array<number>): boolean {
    return this.stringValueContainsAll(name) || values.reduce((acc, v) => acc || this.stringValueContainsNumber(name, v), false);
  }

  containsAllOf(name: string, values: Array<number>): boolean {
    return this.stringValueContainsAll(name) || values.reduce((acc, v) => acc && this.stringValueContainsNumber(name, v), true);
  }

  containsCustom(name: string): boolean {
    return this.stringValueContainsAll(name) || this.stringValueContainsAnyCustomNumber(name);
  }

  private getBooleanValue(name: string): boolean {
    return this.permissions[name] && this.permissions[name].valueB;
  }

  private getStringValue(name: string): string {
    return this.permissions[name] && this.permissions[name].valueS || '';
  }

  private getStringValueAsArray(name: string): Array<number> {
    return this.getStringValue(name).split(',').map(Number);
  }

  private stringValueContainsAll(name: string): boolean {
    return this.getStringValue(name) === 'ALL';
  }

  private stringValueContainsNumber(name: string, value: number): boolean {
    return this.getStringValueAsArray(name).includes(value);
  }

  private stringValueContainsAnyCustomNumber(name: string): boolean {
    return this.getStringValueAsArray(name).reduce((acc, value) =>
      acc || value > UserPermissions.CUSTOM_PERMISSION_THRESHOLD, false);
  }
}
