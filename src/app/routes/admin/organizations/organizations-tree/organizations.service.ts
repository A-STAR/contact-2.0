import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { TreeNode } from '../../../../shared/components/flowtree/common/api';
import { IOrganization, IOrganizationsResponse } from '../organizations.interface';

@Injectable()
export class OrganizationsService {
  constructor(private gridService: GridService) {}

  load(): Observable<Array<TreeNode>> {
    return this.gridService
      .read('/api/organizations')
      .map((response: IOrganizationsResponse) => this.convertToTreeNodes(response.organizations));
  }

  create(organization: any): Observable<any> {
    return this.gridService.create('/api/organizations', {}, organization);
  }

  save(organizationId: number, organization: any): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}', { organizationId }, organization);
  }

  remove(organizationId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}', { organizationId });
  }

  private convertToTreeNodes(organizations: Array<IOrganization>): Array<TreeNode> {
    return organizations
      .sort((a: IOrganization, b: IOrganization) => a.sortOrder > b.sortOrder ? 1 : -1)
      .map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(organization: IOrganization): TreeNode {
    const hasChildren = organization.children && organization.children.length;
    return {
      id: organization.id,
      bgColor: organization.boxColor,
      label: organization.name,
      children: hasChildren ? this.convertToTreeNodes(organization.children) : undefined,
      data: organization
    };
  }
}
