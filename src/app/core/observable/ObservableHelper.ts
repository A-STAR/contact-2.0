import { Subscription } from 'rxjs/Subscription';

export class ObservableHelper {

  static subscribe(subscription: Subscription, component: any): void {
    const ngOnDestroyFn: Function = Reflect.get(component, 'ngOnDestroy');

    Reflect.set(component, 'ngOnDestroy', function(): void {
      if (ngOnDestroyFn) {
        ngOnDestroyFn.apply(this, arguments);
      }
      subscription.unsubscribe();
    });
  }
}
