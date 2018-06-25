import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

import { ILetterPayload } from '@app/core/task/task.interface';

import { TaskService } from '@app/core/task/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-result',
  templateUrl: 'task-result.component.html'
})
export class TaskResultComponent implements OnInit, OnDestroy {

  letterResult: ILetterPayload;

  private letterGenerationSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.letterGenerationSub = this.taskService.letterGeneration$
      .pipe(
        filter(Boolean)
      )
      .subscribe(result => {
        this.letterResult = result;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.letterGenerationSub.unsubscribe();
  }

  onCloseResult(): void {
    this.letterResult = null;
  }
}
