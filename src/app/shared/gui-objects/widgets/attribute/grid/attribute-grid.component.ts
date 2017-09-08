import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent {
  get rows(): Array<any> {
    return Array(1e3).fill(null).map((_, i) => ({ name: `Item #${i}` }));
  }
}
