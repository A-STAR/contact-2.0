import { IFilter, IFilterParams, IDoesFilterPassParams } from 'ag-grid';

export class GridTextFilter implements IFilter {
  valueGetter: Function;
  filterText: string;
  elFilterText: Element;
  gui: HTMLElement;

  init(params: IFilterParams): void {
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.setupGui(params);
  }

  getGui(): HTMLElement {
    return this.gui;
  }

  // not called by ag-Grid, just for us to help setup
  private setupGui(params: IFilterParams): void {
    const that = this;
    function listener(event: Event): void {
      const { target } = event;
      that.filterText = (target as HTMLInputElement).value;
      params.filterChangedCallback();
    }

    this.gui = document.createElement('div');
    this.gui.innerHTML = `
      <div style="padding: 4px 6px; width: 200px;">
        <div>
          <input style="margin: 4px 0px 4px 0px; width: 100%;" type="text" class="filterText" placeholder="filter..."/>
        </div>
      </div>
    `;

    this.elFilterText = this.gui.querySelector('.filterText');
    // this.elFilterText.addEventListener('change', listener);
    // this.elFilterText.addEventListener('paste', listener);
    this.elFilterText.addEventListener('input', listener);
    // IE doesn't fire changed for special keys (eg delete, backspace), so need to
    // listen for this further ones
    // this.elFilterText.addEventListener('keydown', listener);
    // this.elFilterText.addEventListener('keyup', listener);
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // make sure each word passes separately, ie search for firstname, lastname
    console.log(`filter text: ${this.filterText}, params: ${this.valueGetter(params)}`);
    return this.filterText
      .toLowerCase()
      .split(' ')
      .every(filterWord => {
        return this.valueGetter(params).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
  }

  isFilterActive(): boolean {
    return !!this.filterText;
  }

  getModel(): string  {
    return (this.elFilterText as HTMLInputElement).value || null;
  }

  setModel(model: string): void {
    (this.elFilterText as HTMLInputElement).value = model;
  }

  getModelAsString(): string {
    return this.filterText;
  }

  destroy(): void {
    // this.elFilterText.removeEventListener('input', this.onFilterChanged);
    console.log('filter destroyed');
  }

}
