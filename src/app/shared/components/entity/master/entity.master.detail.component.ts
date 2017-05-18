export class EntityMasterDetailComponent<T> {

  currentMaster: T;

  onSelectMaster(currentMaster: T): void {
    this.currentMaster = currentMaster;
  }
}
