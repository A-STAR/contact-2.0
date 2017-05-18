export class MasterDetailComponent<T> {

  masterEntity: T;

  onSelectMaster(masterEntity: T): void {
    this.masterEntity = masterEntity;
  }
}
