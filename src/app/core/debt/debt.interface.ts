export interface IContactRegistrationParams {
  campaignId: number;
  contactId: number;
  contactType: number;
  debtId: number;
  personId: number;
  personRole: number;
}

export interface IContact {
  isInactive: boolean | number;
}

export interface IAddress extends IContact {
  id: number;
}

export interface IDebt {
  id: number;
  statusCode: number;
}

export interface IPhone extends IContact {
  id: number;
}
