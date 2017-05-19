import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../shared/components/grid/grid.service';
import { TreeNode } from '../../../shared/components/flowtree/common/api';
import { IOrganization, IOrganizationsResponse } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  constructor(private gridService: GridService) {}

  load(): Observable<Array<TreeNode>> {
    return this.gridService
      .read('/api/organizations')
      .map((response: IOrganizationsResponse) => this.convertToTreeNodes(response.organizations));
  }

  private convertToTreeNodes(organizations: Array<IOrganization>): Array<TreeNode> {
    return organizations.map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(organization: IOrganization): TreeNode {
    return {
      id: organization.id,
      bgColor: organization.boxColor,
      label: organization.name,
      children: organization.children && organization.children.length ? this.convertToTreeNodes(organization.children) : undefined,
      data: organization
    };
  }
}
