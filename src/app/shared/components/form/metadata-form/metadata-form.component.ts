import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IMetadataFormConfig } from './metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent implements OnInit {
  formGroup: FormGroup;

  @Input() config: IMetadataFormConfig;

  ngOnInit(): void {
    const controls = this.config.items.reduce((acc, item) => ({ ...acc, [item['name']]: new FormControl('') }), {});
    this.formGroup = new FormGroup(controls);
  }
}
