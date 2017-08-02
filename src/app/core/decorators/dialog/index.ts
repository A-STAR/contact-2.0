interface Dialog {
  dialog: string;
  isDialog(dialog: string): boolean;
  setDialog(dialog: string): void;
}

// const dlg = {
//   dialog: null,
//   isDialog: (dialog: string) => this.dialog === dialog,
//   setDialog: (dialog: string) => this.dialog = dialog,
// }

// interface DialogDecorator {
//   (obj: Dialog): TypeDecorator;
//   new (obj: Dialog): Dialog;
// }

// const Dialog = makeDecorator('Dialog', (d: Dialog) => ({
//   ...d,
// }));

export function Dialog(): any {
  return (cls) => {
    const original: any = cls;

    function construct(constructor: Function, args: any): any {
      const C: any = function (): any {
        this.dialog = null;
        return constructor.apply(this, args);
      }

      C.prototype = constructor.prototype;

      C.prototype.setDialog = function(dialog: string): void {
        this.dialog = dialog;
      }
      C.prototype.isDialog = function(dialog: string): boolean {
        return this.dialog === dialog;
      }
      C.prototype.closeDialog = function(): boolean {
        return this.dialog = null;
      }

      return new C();
    }

    const F: any = function (...args: any[]): any {
      return construct(original, args);
    }

    F.prototype = original.prototype;

    return F;
  };
}
