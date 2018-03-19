import { IValueBag } from './value-bag.interface';

export class ValueBag {
  static CUSTOM_VALUE_THRESHOLD = 20000;

  constructor(private bag: IValueBag) {}

  get(name: string): any {
    const item = this.bag[name];
    return item && item.valueN || item.valueS;
  }

  has(name: string): boolean {
    return this.getBooleanValue(name);
  }

  hasOneOf(names: string[]): boolean {
    return names.reduce((acc, name) => acc || this.getBooleanValue(name), false);
  }

  hasAllOf(names: string[]): boolean {
    return names.reduce((acc, name) => acc && this.getBooleanValue(name), true);
  }

  notEmpty(name: string): boolean {
    return this.getStringValue(name) !== '';
  }

  notEmptyOneOf(names: string[]): boolean {
    return names.reduce((acc, name) => acc || this.getStringValue(name) !== '', false);
  }

  notEmptyAllOf(names: string[]): boolean {
    return names.reduce((acc, name) => acc && this.getStringValue(name) !== '', true);
  }

  contains(name: string, value: number): boolean {
    return this.containsALL(name) || this.stringValueContainsNumber(name, value);
  }

  containsOneOf(name: string, values: number[]): boolean {
    return this.containsALL(name) || values.reduce((acc, v) => acc || this.stringValueContainsNumber(name, v), false);
  }

  containsAllOf(name: string, values: number[]): boolean {
    return this.containsALL(name) || values.reduce((acc, v) => acc && this.stringValueContainsNumber(name, v), true);
  }

  containsCustom(name: string): boolean {
    return this.getStringValueAsArray(name).reduce((acc, value) => acc || value > ValueBag.CUSTOM_VALUE_THRESHOLD, false);
  }

  containsALL(name: string): boolean {
    return this.getStringValue(name) === 'ALL';
  }

  getStringValueAsArray(name: string): number[] {
    return this.getStringValue(name).split(/,\s*/).map(Number);
  }

  private getBooleanValue(name: string): boolean {
    return this.bag[name] && this.bag[name].valueB;
  }

  private getStringValue(name: string): string {
    return this.bag[name] && this.bag[name].valueS || '';
  }

  private stringValueContainsNumber(name: string, value: number): boolean {
    return this.getStringValueAsArray(name).includes(value);
  }

}
