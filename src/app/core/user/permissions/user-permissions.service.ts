import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../shared/components/grid/grid.service';
import { IUserPermissionModel, IUserPermissionsResponse } from './user-permissions.interface';

@Injectable()
export class UserPermissionsService {

  private userPermits: Map<string, boolean> = new Map<string, boolean>();

  constructor(private gridService: GridService) {
    // TODO Temp solution
    this.loadUserPermissions();
  }

  public loadUserPermissions(): Observable<boolean> {
    return Observable.create((observer) => {

      this.gridService.read('/api/userpermits').then(
        (response: IUserPermissionsResponse) => {
          response.userPermits.forEach((userPermission: IUserPermissionModel) => {
            this.userPermits.set(userPermission.name, this.toUserPermissionValue(userPermission));
          });

          observer.next(true);
          observer.complete();
        }, () => {
          observer.next(false);
          observer.complete();
        });
    });
  }

  public hasPermission(permissionName: string): boolean {
    return this.userPermits.get(permissionName) || false;
  }

  private toUserPermissionValue(userPermissionModel: IUserPermissionModel): boolean {
    if (userPermissionModel.valueB !== null) {
      return userPermissionModel.valueB;
    } else if (userPermissionModel.valueN !== null) {
      return !!userPermissionModel.valueN;
    } else if (userPermissionModel.valueS !== null) {
      return !!parseInt(userPermissionModel.valueS, 10);
    }
    return false;
  }
}
