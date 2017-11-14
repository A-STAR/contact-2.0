export interface IAddress extends IContact {
  id: number;
}

export interface IContact {
  isInactive: boolean | number;
}

export interface IDebt {
  id: number;
  statusCode: number;
}

export interface IPhone extends IContact {
  id: number;
}
