import { Component } from 'ag-grid';
import { RowGroupCompFactory } from 'ag-grid-enterprise/main';

const originalFn: Function = RowGroupCompFactory.prototype.create;
RowGroupCompFactory.prototype.create = function (): Component {
  const component = originalFn.apply(this, arguments);
  Reflect.defineProperty(component.params, 'emptyMessage', {
    get: () => component.gridOptionsWrapper.gridOptions.localeText.rowGroupColumnsEmptyMessage
  });
  return component;
};
