import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DialogFunctions } from '../../../core/dialog';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends DialogFunctions {
  static COMPONENT_NAME = 'CampaignsComponent';

  @ViewChild(GridComponent) grid: GridComponent;
  dialog: string;


  constructor(private gridService: GridService,
              private cdRef: ChangeDetectorRef,
              private userPermissionsService: UserPermissionsService) {
    super();
  }
}
