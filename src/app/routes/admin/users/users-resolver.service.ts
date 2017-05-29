import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/Observable/zip';

import { IUser } from './users.interface';

import { UsersService } from './users.service';

@Injectable()
export class UsersResolver implements Resolve<Array<IUser>> {

  constructor(
    private usersService: UsersService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
    return zip(
      this.usersService.getRoles(),
      this.usersService.getLanguages(),
      (roles, languages) => [ roles, languages ]
    );
  }
}
