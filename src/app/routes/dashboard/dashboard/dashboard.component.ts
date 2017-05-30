import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import { INotificationType } from '../../../core/notifications/notifications.interface';

import { ColorsService } from '../../../shared/colors/colors.service';
import { NotificationsActions } from '../../../core/notifications/notifications.actions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  easyPiePercent = 70;
  pieOptions = {
    animate: {
      duration: 800,
      enabled: true
    },
    barColor: this.colors.byName('info'),
    trackColor: 'rgba(200,200,200,0.4)',
    scaleColor: false,
    lineWidth: 10,
    lineCap: 'round',
    size: 145
  };

  sparkOptions1 = {
    barColor: this.colors.byName('info'),
    height: 30,
    barWidth: '5',
    barSpacing: '2'
  };

  sparkOptions2 = {
    type: 'line',
    height: 80,
    width: '100%',
    lineWidth: 2,
    lineColor: this.colors.byName('purple'),
    spotColor: '#888',
    minSpotColor: this.colors.byName('purple'),
    maxSpotColor: this.colors.byName('purple'),
    fillColor: '',
    highlightLineColor: '#fff',
    spotRadius: 3,
    resize: true
  };

  splineHeight = 280;
  splineData: any;
  splineOptions = {
    series: {
      lines: {
        show: false
      },
      points: {
        show: true,
        radius: 4
      },
      splines: {
        show: true,
        tension: 0.4,
        lineWidth: 1,
        fill: 0.5
      }
    },
    grid: {
      borderColor: '#eee',
      borderWidth: 1,
      hoverable: true,
      backgroundColor: '#fcfcfc'
    },
    tooltip: true,
    tooltipOpts: {
      content: (label, x, y) => { return x + ' : ' + y; }
    },
    xaxis: {
      tickColor: '#fcfcfc',
      mode: 'categories'
    },
    yaxis: {
      min: 0,
      max: 150,
      tickColor: '#eee',
      // position: ($scope.app.layout.isRTL ? 'right' : 'left'),
      tickFormatter: v => v
    },
    shadowSize: 0
  };

  constructor(
    private colors: ColorsService,
    private http: AuthHttp,
    private notificationsActions: NotificationsActions,
  ) { }

  ngOnInit(): void {
    this.http.get('assets/server/chart/spline.json')
      .map(data => data.json())
      .subscribe(data => this.splineData = data);
  }

  colorByName(name: string): string {
    return this.colors.byName(name);
  }

  addNotification(type: INotificationType): void {
    const message = ((t: INotificationType) => {
      switch (t) {
        case 'ERROR':
          return 'I am error message.';
        case 'WARNING':
          return 'I am warning message.';
        case 'INFO':
          return 'I am info message.';
      }
    })(type);
    this.notificationsActions.push(message, type);
  }

  clearNotifications(): void {
    this.notificationsActions.reset();
  }
}
