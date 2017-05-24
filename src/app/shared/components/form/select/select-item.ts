import { IdType } from './select-interfaces';

export class SelectItem {
  public id: IdType;
  public text: string;
  public children: Array<SelectItem>;
  public parent: SelectItem;

  public constructor(source: any, private idKey: string, private textKey: string) {
    if (typeof source === 'string') {
      this.id = this.text = source;
    }
    if (typeof source === 'object') {
      this.id = source.id || source.text;
      this.text = source.text;
      if (source.children && source.text) {
        this.children = source.children.map((c: any) => {
          const r: SelectItem = new SelectItem(c, idKey, textKey);
          r.parent = this;
          return r;
        });
        this.text = source.text;
      }
    }

    // Client should be able to work with the business-layer keys
    Reflect.defineProperty(this, idKey, {
      get: () => this.id
    });
    Reflect.defineProperty(this, textKey, {
      get: () => this.text
    });
  }

  public fillChildrenHash(optionsMap: Map<IdType, number>, startIndex: number): number {
    let i = startIndex;
    this.children.map((child: SelectItem) => {
      optionsMap.set(child.id, i++);
    });
    return i;
  }

  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar(): SelectItem {
    return Object.assign(new SelectItem(false, this.idKey, this.textKey), {
      id: this.text,
      text: this.text,
      parent: this.parent
    });
  }
}
