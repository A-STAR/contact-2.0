import { IOrganizationsState } from './organizations.interface';
import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { OrganizationsService } from './organizations.service';

export const defaultState: IOrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  employees: [],
  selectedEmployeeUserId: null
};

export function findOrganizationNode(nodes: ITreeNode[], selectedOrganizationNode: ITreeNode): ITreeNode {
  if (!selectedOrganizationNode) {
    return null;
  }
  let result;
  (nodes || []).forEach(
    node => result = result || (node.id === selectedOrganizationNode.id
      ? node
      : findOrganizationNode(node.children, selectedOrganizationNode))
  );
  return result;
}

export function reducer(state: IOrganizationsState = defaultState, action: SafeAction<IOrganizationsState>): IOrganizationsState {
  switch (action.type) {
    case OrganizationsService.ORGANIZATION_SELECT:
      return {
        ...state,
        organizations: action.payload.organizations || state.organizations,
        selectedOrganization: action.payload.selectedOrganization ||
          // Here state.selectedOrganization is pointed to old instance from the previous state.organizations instance
          // so we should find him actual mirror by id
          findOrganizationNode(state.organizations, state.selectedOrganization)
      };
    case OrganizationsService.EMPLOYEE_SELECT:
      return {
        ...state,
        employees: action.payload.employees || state.employees,
        selectedEmployeeUserId: action.payload.selectedEmployeeUserId
      };
    default:
      return state;
  }
}
