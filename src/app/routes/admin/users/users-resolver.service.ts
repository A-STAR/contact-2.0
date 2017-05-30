import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { IUser } from './users.interface';

import { UsersService } from './users.service';

@Injectable()
export class UsersResolver implements Resolve<Array<IUser>> {

  constructor(
    private usersService: UsersService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
    return Observable.zip(
      this.usersService.getRoles(),
      this.usersService.getLanguages(),
      (roles, languages) => [ roles, languages ]
    );
  }
}
