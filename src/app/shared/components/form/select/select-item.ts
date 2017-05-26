import { IdType } from './select-interfaces';

export class SelectItem {
  id: IdType;
  text: string;
  parent: SelectItem;
  selected: boolean;
  context?: any;

  get value(): IdType {
    return this.id;
  }

  get label(): IdType {
    return this.text;
  }

  constructor(source: any) {
    if (typeof source === 'string') {
      this.id = this.text = source;
    }
    if (typeof source === 'object') {
      this.id = source.id || source.text;
      this.text = source.text;
      this.selected = source.selected;
    }
  }
}
