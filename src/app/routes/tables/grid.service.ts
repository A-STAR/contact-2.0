import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GridService {

  constructor(private http: Http) { }

  fetchData() {
    return this.http.get('assets/server/100k.json')
      .toPromise()
      .then(data => data.json());
  }
}
