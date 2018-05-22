import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { ILetterGenerationParams } from './letter-generation.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';


@Injectable()
export class LetterGenerationService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  generate(idData: IGridActionPayload, actionData: ILetterGenerationParams): Observable<void> {
    return this.dataService
      .create('/async/mass/letters/form', {},
        {
          idData: this.actionGridService.buildRequest(idData),
          actionData
        }
      )
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.letters.gen.plural').dispatchCallback()),
      );
  }
}
