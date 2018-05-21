import { Page } from 'puppeteer';

export const scrollTo = (gridSelector: string, columnIndex: number, value: string): Promise<void> => {
  const page: Page = global['__PAGE__'];
  return page.evaluate((_gridSelector, _columnIndex, _value) => {
    const viewport = document.querySelector(`${_gridSelector} .ag-body .ag-body-viewport`);
    const container = document.querySelector(`${_gridSelector} .ag-body .ag-body-container`);
    if (viewport && container) {
      const viewportRect = viewport.getBoundingClientRect();
      const viewportHeight = viewportRect.height;
      const viewportTop = viewportRect.top;
      const viewportBottom = viewportRect.bottom;
      const containerHeight = container.getBoundingClientRect().height;
      const n = Math.floor(containerHeight / viewportHeight + 1);
      for (let i = 0; i < n; i++) {
        const cells = document.querySelectorAll(`${_gridSelector} .ag-body .ag-row .ag-cell:nth-child(${_columnIndex})`);
        for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          const cellRect = cell.getBoundingClientRect();
          if (cellRect.bottom > viewportTop && cellRect.top < viewportBottom && cell.textContent.includes(_value)) {
            return;
          }
        }
        viewport.scrollTop += viewportHeight;
      }
    }
  }, gridSelector, columnIndex, value);
};
