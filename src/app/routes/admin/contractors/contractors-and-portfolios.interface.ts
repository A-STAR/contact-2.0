export interface IContractor {
  id: number;
  // TODO(d.maltsev)
}

export interface IPortfolio {
  id: number;
  // TODO(d.maltsev)
}

export interface IContractorsAndPortfoliosState {
  contractors: Array<IContractor>;
  portfolios: Array<IPortfolio>;
}
