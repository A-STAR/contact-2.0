export abstract class DialogFunctions {
  /**
   * NOTE: this prop cannot come from the prototype and has to be implemented in the children
   *
   * @abstract
   * @type {string}
   * @memberof DialogFunctions
   */
  abstract dialog: string;

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string = null): void {
    this.dialog = dialog;
  }

  closeDialog(): void {
    this.setDialog();
  }
  /**
   * Same as `closeDialog` just to maintain the `on` prefix used in EventEmitters
   *
   * @memberof DialogFunctions
   */
  onCloseDialog(): void {
    this.setDialog();
  }

  onResult(): void {
    //
  }
}
