//  TODO mock (m.bobryshev), sh.b. debtId, addressesId, personRole
export interface IVisitParam {
  debtId: number;
  personId: number;
  regionCode: number;
}

export interface IVisitsBundle {
  // TODO make type exact (m.bobryshev)
  actionData: {
    purposeCode: number;
    comment: string;
  };
}
