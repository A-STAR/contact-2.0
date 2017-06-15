// Prevent trembling effect when move and click are being happened simultaneously
const crossvent: { add: Function, remove: Function } = require('crossvent');

const crossventAddFn: Function = crossvent.add;
const crossventRemoveFn: Function = crossvent.remove;
const cachedFn = {};
const SLIDE_FACTOR_IN_PIXELS = 2;

let _moveX = 0, _moveY = 0;

crossvent.add = function (el: Element, type: string, fn: Function, capturing: boolean): void {
  const originalFn = fn;
  if (fn.name === 'startBecauseMouseMoved') {
    fn = function (event: MouseEvent): void {
      if ((Math.abs(event.clientY - _moveY) <= SLIDE_FACTOR_IN_PIXELS)
        && (Math.abs(event.clientX - _moveX) <= SLIDE_FACTOR_IN_PIXELS)) {
        return;
      }
      return originalFn.apply(this, arguments);
    };
    cachedFn['startBecauseMouseMoved'] = fn;
  } else if (fn.name === 'grab') {
    fn = function (event: MouseEvent): void {
      _moveX = event.clientX;
      _moveY = event.clientY;
      return originalFn.apply(this, arguments);
    };
    cachedFn['grab'] = fn;
  }
  return crossventAddFn.apply(crossvent, [el, type, fn, capturing]);
};

crossvent.remove = function (el: Element, type: string, fn: Function, capturing: boolean): void {
  fn = cachedFn[fn.name] || fn;
  delete cachedFn[fn.name];
  return crossventRemoveFn.apply(crossvent, [el, type, fn, capturing]);
};
