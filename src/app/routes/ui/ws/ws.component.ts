import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

import { IWSData } from '@app/routes/ui/ws/ws.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { WSService } from './ws.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-ws',
  templateUrl: './ws.component.html'
})
export class WSComponent implements OnInit, OnDestroy {
  columns: ISimpleGridColumn<IWSData>[] = [
    { prop: 'username', minWidth: 120 },
    { prop: 'date', minWidth: 160, label: 'sent' },
    { prop: 'received', minWidth: 160 },
    { prop: 'dropAvailable', renderer: TickRendererComponent, minWidth: 160 },
    { prop: 'holdAvailable', renderer: TickRendererComponent, minWidth: 160 },
    { prop: 'lineStatus', renderer: TickRendererComponent, minWidth: 160 },
    { prop: 'makeAvailable', renderer: TickRendererComponent, minWidth: 160 },
    { prop: 'transferAvailable', renderer: TickRendererComponent, minWidth: 160 },
  ].map((c: any) => ({ ...c, label: c.label || c.prop } as ISimpleGridColumn<IWSData>));

  request: string;
  data: IWSData[] = [];

  private wsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private wsService: WSService,
  ) {}

  ngOnInit(): void {
    this.wsService.open();
    this.wsSub = this.wsService.listener$.subscribe(item => {
      this.data = [
        ...this.data,
        {
          ...item,
          received: moment().format('DD.MM.YYYY HH.mm.ss SSS'),
        }
      ];
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.wsSub.unsubscribe();
    this.wsService.close();
  }

  onSendClick(): void {
    this.wsService.send(this.request);
  }
}
