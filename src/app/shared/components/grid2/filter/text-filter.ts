import { IFilter, IFilterParams, IDoesFilterPassParams } from 'ag-grid';

export class GridTextFilter implements IFilter {
  template = `
    <div class="ag-custom-filter">
      <input type="text" class="ag-custom-filter-text" placeholder="filter..."/>
    </div>
  `;
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

  // TODO(a.tymchuk): how do we remove the listener, if `destroy` doesn't get called ?
  private setupGui(params: IFilterParams): void {
    const that = this;
    function listener(event: Event): void {
      const { target } = event;
      that.filterText = (target as HTMLInputElement).value;
      params.filterChangedCallback();
    }

    this.gui = document.createElement('div');
    this.gui.innerHTML = this.template;

    this.elFilterText = this.gui.querySelector('.ag-custom-filter-text');
    // this.elFilterText.addEventListener('change', listener);
    // this.elFilterText.addEventListener('paste', listener);
    this.elFilterText.addEventListener('input', listener);
    // IE doesn't fire changed for special keys (eg delete, backspace), so need to
    // listen for this further ones
    // this.elFilterText.addEventListener('keydown', listener);
    // this.elFilterText.addEventListener('keyup', listener);
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // make sure each separate word passes separately
    // p.e. `Rebecca Show` could be filtered as `re sh`
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
