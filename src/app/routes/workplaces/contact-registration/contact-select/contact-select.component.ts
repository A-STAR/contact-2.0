import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-select',
  templateUrl: 'contact-select.component.html'
})
export class ContactSelectComponent {
  @Input() debtId: number;
  @Input() personId: number;

  tabs = [
    { isInitialised: true, title: 'selectFromDebt' },
    { isInitialised: false, title: 'selectFromAll' },
    { isInitialised: false, title: 'add' },
  ].map(tab => ({ ...tab, title: `modules.contactRegistration.contactGrid.tabs.${tab.title}.title` }));

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
