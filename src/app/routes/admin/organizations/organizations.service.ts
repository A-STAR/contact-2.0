import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

import { TreeNode } from '../../../shared/components/flowtree/common/api';

@Injectable()
export class OrganizationsService {

  constructor(public http: AuthHttp) { }

  getNodes(): Observable<TreeNode[]> {
    return this.http.get('assets/server/workflow.json')
            .map(res => res.json().data as TreeNode[]);
  }
}
