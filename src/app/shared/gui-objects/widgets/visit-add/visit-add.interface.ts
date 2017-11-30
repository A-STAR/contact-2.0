export interface ISingleVisitRels {
  debtId: number;
  addressId: number;
  personRole: number;
}

export interface IVisitsBundle {
  idData: {
    complexIdList: ISingleVisitRels[]
  };
  actionData: {
    purposeCode: number;
    comment: string;
  };
}
