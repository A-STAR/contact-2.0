import { DetachedRouteHandle } from '@angular/router';

export interface IRouteCache {
  [key: string]: {
      handle: DetachedRouteHandle;
      showTab: boolean;
  };
}
