import { Injectable } from '@angular/core';
import { filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import {
  ICustomOperationEvent,
  IFinishErrorTaskEvent,
  IFinishSuccessTaskEvent,
  ILetterGenerationEvent,
  IMassOperationEvent,
  IStartSuccessTaskEvent,
  ITaskEvent,
  TaskEventType,
  TaskStatus,
} from '@app/core/task/task.interface';
import { IWSConnection } from '@app/core/ws/ws.interface';

import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { WSService } from '@app/core/ws/ws.service';

@Injectable()
export class TaskService {

  constructor(
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
    private wsService: WSService,
  ) {}

  init(): void {
    this.wsService.connect<ITaskEvent>('/wsapi/taskStatus')
      .pipe(
        mergeMap((connection: IWSConnection<ITaskEvent>) => connection.listen()),
        filter(Boolean),
        withLatestFrom(this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_TASK_TYPE)),
      )
      .subscribe(([ task, terms ]) => {
        const term = terms.find(t => t.code === task.taskTypeCode);
        if (term) {
          switch (task.statusCode) {
            case TaskStatus.START_SUCCESS:
              this.onStart(task, term.name);
              break;
            case TaskStatus.FINISH_SUCCESS:
              switch (task.taskEventTypeCode) {
                case TaskEventType.MASS_OPERATION:
                  this.onMassOperation(task, term.name);
                  break;
                case TaskEventType.CUSTOM_OPERATION:
                  this.onCustomOperation(task, term.name);
                  break;
                case TaskEventType.LETTER_GENERATION:
                  this.onLetterGeneration(task, term.name);
                  break;
              }
              break;
            case TaskStatus.FINISH_ERROR:
              this.onError(task, term.name);
              break;
          }
        }
      });
  }

  private onStart(task: IStartSuccessTaskEvent, message: string): void {
    this.notificationsService
      .info('system.notifications.tasks.start.success')
      .params({
        createDateTime: this.getCreateDateTime(task),
        message,
      })
      .dispatch();
  }

  private onError(task: IFinishErrorTaskEvent, message: string): void {
    this.notificationsService
      .error('system.notifications.tasks.finish.error')
      .params({
        createDateTime: this.getCreateDateTime(task),
        message,
      })
      .dispatch();
  }

  private onMassOperation(task: IMassOperationEvent, message: string): void {
    this.notificationsService
      .info('system.notifications.tasks.finish.success')
      .params({
        createDateTime: this.getCreateDateTime(task),
        info: this.getInfo(task),
        message,
      })
      .dispatch();
  }

  private onCustomOperation(task: ICustomOperationEvent, message: string): void {
    // TODO(d.maltsev, i.kibisov): display custom operation output
    this.notificationsService
      .info('system.notifications.tasks.finish.success')
      .params({
        createDateTime: this.getCreateDateTime(task),
        info: this.getInfo(task),
        message,
      })
      .dispatch();
  }

  private onLetterGeneration(task: ILetterGenerationEvent, message: string): void {
    // TODO(d.maltsev, i.kibisov): display letter generation output
    this.notificationsService
      .info('system.notifications.tasks.finish.success')
      .params({
        createDateTime: this.getCreateDateTime(task),
        info: this.getInfo(task),
        message,
      })
      .dispatch();
  }

  private getInfo(task: IFinishSuccessTaskEvent): string {
    const { massInfo } = task.payload;
    return Object.keys(massInfo)
      .filter(key => massInfo[key])
      .map(key => this.translateService.instant(`system.notifications.tasks.${key}`, { n: String(massInfo[key]) }))
      .join(', ');
  }

  private getCreateDateTime(task: ITaskEvent): string {
    const { currentLang } = this.translateService;
    return moment(task.createDateTime).locale(currentLang).format('L HH:mm:ss');
  }
}
