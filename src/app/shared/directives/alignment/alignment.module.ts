import { NgModule } from '@angular/core';

import { AlignmentDirective } from '@app/shared/directives/alignment/alignment.directive';

@NgModule({
  exports: [
    AlignmentDirective,
  ],
  declarations: [
    AlignmentDirective,
  ],
})
export class AlignmentModule {}
