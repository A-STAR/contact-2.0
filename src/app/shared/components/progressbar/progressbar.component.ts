import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

import { IProgressbarType } from './progressbar.interface';

import { ProgressBarService } from './progressbar.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html'
})
export class ProgressbarComponent implements OnInit, OnDestroy {
  @Input() value: number;
  @Input() type: IProgressbarType = 'info';

  private interval = null;
  private intervalSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private progressBarService: ProgressBarService
  ) { }

  ngOnInit(): void {
    this.intervalSub = this.progressBarService.getPayload<number>(ProgressBarService.MESSAGE_PROGRESS)
      .pipe(
        filter(value => value && !this.interval)
      )
      .subscribe(value => {
        this.runProgress(0, 100 / value);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  get cssClass(): string {
    return `progress-bar progress-bar-${this.type} progress-bar-striped`;
  }

  get style(): object {
    return {
      width: `${this.value}%`
    };
  }

  private runProgress(value: number, increase: number): void {
    this.value = value;
    this.interval = setInterval(() => {
      if (this.value >= 0 && this.value <= 100) {
        this.value += increase;
      } else {
        clearInterval(this.interval);
        this.interval = null;
        this.value = null;
      }
    }, 1000);
  }
}
