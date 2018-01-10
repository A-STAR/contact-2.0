import { DetachedRouteHandle } from '@angular/router';

export interface IRouteConfigData {
  reuse: boolean;
}

export interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}
