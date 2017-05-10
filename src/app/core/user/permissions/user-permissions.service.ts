import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserPermissionsService {

  public loadUserPermissions(): Observable<boolean> {
    return Observable.create((observer) => {
      setTimeout(() => {
        // TODO load permissions
        observer.next(true);
        console.log('PERMISSIOBNS!');
        observer.complete();
      }, 4000);
    });
  }

  public hasPermission(): boolean {
    return false;
  }
}
