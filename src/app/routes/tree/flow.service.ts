import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { TreeNode } from '../../shared/components/flowtree/common/api';

@Injectable()
export class FlowService {

  constructor(public http: Http) {}

  getFiles() {
    return this.http.get('assets/server/workflow.json')
            .toPromise()
            .then(res => <TreeNode[]> res.json().data);
  }
}
