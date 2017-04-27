import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GridService {

  constructor(private http: Http) { }

  fetchData(url: string = 'assets/server/100k.json') {
    return this.http.get(url)
      .toPromise()
      .then(data => data.json());
  }
}
