import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, scan } from 'rxjs/operators';

import { WSService } from './ws.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-ws',
  templateUrl: './ws.component.html'
})
export class WSComponent {
  request: string;

  constructor(
    private wsService: WSService,
  ) {}

  get response$(): Observable<string> {
    return this.wsService.listener$.pipe(
      scan((acc, message: string) => [ ...acc, message ], []),
      map(messages => messages.join('\n')),
    );
  }

  onSendClick(): void {
    this.wsService.send(this.request);
  }
}
