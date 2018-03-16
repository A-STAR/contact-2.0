import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '@app/core/state/state.interface';
import { IMetadataFormConfig, IMetadataFormValidator } from './metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent implements OnInit {
  formGroup: FormGroup;

  @Input() config: IMetadataFormConfig;

  constructor(
    private store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    const controls = this.config.items.reduce((acc, item) => ({ ...acc, [item['name']]: new FormControl('') }), {});
    this.formGroup = new FormGroup(controls);
  }

  getValidator<T>(validator: IMetadataFormValidator<T>): Observable<T> {
    return typeof validator === 'string'
      ? this.store.pipe(select(state => this.getSlice(state, validator)))
      : of(validator);
  }

  private getSlice(object: any, path: string): any {
    return path.split('/').reduce((acc, chunk) => acc && acc[chunk], object);
  }
}
