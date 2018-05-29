import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-genesys-campaigns',
  templateUrl: 'genesys.component.html'
})
export class GenesysCampaignsComponent {

}
