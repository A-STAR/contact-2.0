import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GridService {

  constructor(private http: AuthHttp, private authService: AuthService) { }

  read(url: string = ''): Promise<any> {
    if (!url) {
      return this.http.get('assets/server/100k.json')
      .toPromise()
      .then(data => data.json());
    }

    return this.authService
      .getRootUrl()
      .then(root => {
        return this.http.get(`${root}${url}`)
          .toPromise()
          .then(data => data.json());
    });
  }
  // TODO: to be implemented
  create(url: string = ''): Promise<any> {
    return Promise.resolve(false);
  }

  update(url: string = ''): Promise<any> {
    return Promise.resolve(false);
  }

  delete(url: string = ''): Promise<any> {
    return Promise.resolve(false);
  }
}
