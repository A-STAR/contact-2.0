import { IValueBag } from './value-bag.interface';

export class ValueBag {
  static CUSTOM_VALUE_THRESHOLD = 20000;

  constructor(private bag: IValueBag) {}

  has(name: string): boolean {
    return this.getBooleanValue(name);
  }

  hasOneOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc || this.getBooleanValue(name), false);
  }

  hasAllOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc && this.getBooleanValue(name), true);
  }

  notEmpty(name: string): boolean {
    return this.getStringValue(name) !== '';
  }

  notEmptyOneOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc || this.getStringValue(name) !== '', false);
  }

  notEmptyAllOf(names: Array<string>): boolean {
    return names.reduce((acc, name) => acc && this.getStringValue(name) !== '', true);
  }

  contains(name: string, value: number): boolean {
    return this.containsALL(name) || this.stringValueContainsNumber(name, value);
  }

  containsOneOf(name: string, values: Array<number>): boolean {
    return this.containsALL(name) || values.reduce((acc, v) => acc || this.stringValueContainsNumber(name, v), false);
  }

  containsAllOf(name: string, values: Array<number>): boolean {
    return this.containsALL(name) || values.reduce((acc, v) => acc && this.stringValueContainsNumber(name, v), true);
  }

  containsCustom(name: string): boolean {
    return this.stringValueContainsAnyCustomNumber(name);
  }

  containsALL(name: string): boolean {
    return this.getStringValue(name) === 'ALL';
  }

  private getBooleanValue(name: string): boolean {
    return this.bag[name] && this.bag[name].valueB;
  }

  private getStringValue(name: string): string {
    return this.bag[name] && this.bag[name].valueS || '';
  }

  private getStringValueAsArray(name: string): Array<number> {
    return this.getStringValue(name).split(',').map(Number);
  }

  private stringValueContainsNumber(name: string, value: number): boolean {
    return this.getStringValueAsArray(name).includes(value);
  }

  private stringValueContainsAnyCustomNumber(name: string): boolean {
    return this.getStringValueAsArray(name).reduce((acc, value) => acc || value > ValueBag.CUSTOM_VALUE_THRESHOLD, false);
  }
}