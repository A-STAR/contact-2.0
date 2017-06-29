import { Http, RequestOptions } from '@angular/http';
import { AuthConfig } from 'angular2-jwt';
import { getToken } from '../auth/auth.service';

import { HttpService } from '../http/http.service';

/**
 * Must be an exported non-arrow function to pass static analysis.
 * See https://medium.com/@isaacplmann/making-your-angular-2-library-statically-analyzable-for-aot-e1c6f3ebedd5
 */
export function authHttpServiceFactory(http: Http, options: RequestOptions): any {
  return new HttpService(new AuthConfig({
    tokenGetter: getToken,
    noJwtError: true
  }), http, options);
}

export const AuthHttpService = {
  provide: HttpService,
  useFactory: authHttpServiceFactory,
  deps: [Http, RequestOptions]
};
