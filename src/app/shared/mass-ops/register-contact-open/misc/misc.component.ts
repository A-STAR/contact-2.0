import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-register-contact-misc',
  templateUrl: 'misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscComponent {
  @Output() actionSpecial = new EventEmitter<void>();

  onSubmitSpecial(): void {
    this.actionSpecial.emit();
  }
}
