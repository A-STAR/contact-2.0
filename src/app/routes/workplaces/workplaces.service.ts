import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { toTreeNodes } from '@app/core/utils/tree';
import { Debt, Person } from '@app/entities';

@Injectable()
export class WorkplacesService {

  baseUrl = '/persons/{personId}/debts';
  extUrl = `${this.baseUrl}/{debtId}`;

  static CONTACT_TYPE_OFFICE_VISIT  = 8;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private repo: RepositoryService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  fetchDebtor(personId: number): Observable<Person> {
    return this.repo.fetch(Person, { id: personId }).pipe(
      map(persons => persons && persons[0]),
    );
  }

  fetchDebtsForPerson(personId: number): Observable<Debt[]> {
    return this.repo.fetch(Debt, { personId });
  }

  fetchDebt(debtId: number): Observable<Debt> {
    return this.repo.fetch(Debt, { id: debtId }).pipe(
      map(debts => debts && debts[0])
    );
  }

  fetchContactTree(debtId: number, contactType: number): Observable<ITreeNode[]> {
    return this.dataService
      .readAll('/debts/{debtId}/contactTypes/{contactType}/treeResults', { debtId, contactType })
      .pipe(
        map(toTreeNodes()),
        catchError(this.notificationsService.fetchError().entity('entities.contactTreeItems.gen.singular').dispatchCallback())
      );
  }

  fetchContactScenario(debtId: number, contactType: number, treeResultId: number): Observable<string> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/scenarios';
    return this.dataService
      .read(url, { debtId, contactType, treeResultId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.scenarios.gen.singular').dispatchCallback()),
      );
  }

  isDebtActive(debt: { statusCode: number }): boolean {
    return debt && ![6, 7, 8, 17].includes(debt.statusCode);
  }

  changeStatus(personId: number, debtId: number, debt: Partial<Debt>, callCenter: boolean): Observable<any> {
    return this.dataService
      .update(`${this.extUrl}/statuschange`, { debtId, personId }, debt, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  readonly canRegisterOfficeVisit$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', WorkplacesService.CONTACT_TYPE_OFFICE_VISIT);
}
