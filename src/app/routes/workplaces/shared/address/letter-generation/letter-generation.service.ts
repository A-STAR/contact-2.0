import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ILetterGenerationParams } from '@app/routes/workplaces/shared/address/letter-generation/letter-generation.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class LetterGenerationService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  generate(templateId: number, generationParams: ILetterGenerationParams): Observable<void> {
    return this.dataService
      .create('/letters/{templateId}/form', { templateId }, generationParams)
      .catch(this.notificationsService.createError().entity('entities.letters.gen.singular').dispatchCallback());
  }
}
