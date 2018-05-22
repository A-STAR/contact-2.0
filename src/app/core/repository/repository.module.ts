import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { IEntityDef } from './repository.interface';

import { REPOSITORY_ENTITY, RepositoryService } from './repository.service';
import { RepositoryEffects } from '@app/core/repository/repository.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([ RepositoryEffects ]),
  ],
})
export class RepositoryModule {
  static withEntity(entity: IEntityDef): ModuleWithProviders {
    return {
      ngModule: RepositoryModule,
      providers: [
        { provide: REPOSITORY_ENTITY, useValue: entity, multi: true },
      ],
    };
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RepositoryModule,
      providers: [
        RepositoryService,
      ],
    };
  }
}
