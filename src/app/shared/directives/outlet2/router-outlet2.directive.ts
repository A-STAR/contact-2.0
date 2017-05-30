import {
  Attribute,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Injector,
  OnDestroy,
  Output,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterOutletMap, PRIMARY_OUTLET } from '@angular/router';

// tslint:disable-next-line
@Directive({selector: 'app-router-outlet'})
export class RouterOutlet2Directive implements OnDestroy {
  private activated: ComponentRef<any>;
  private _activatedRoute: ActivatedRoute;
  public outletMap: RouterOutletMap;

  // tslint:disable:no-output-rename
  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();
  // tslint:enable:no-output-rename

  activate = RouterOutlet.prototype.activate.bind(this);

  constructor(
    private parentOutletMap: RouterOutletMap,
    private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Attribute('name') private name: string
  ) {

    // console.log('register outlet', name || PRIMARY_OUTLET);
    parentOutletMap.registerOutlet(name ? name : PRIMARY_OUTLET, this as any);
  }

  ngOnDestroy(): void {
    // console.log('remove outlet', this.name || PRIMARY_OUTLET);
    this.parentOutletMap.removeOutlet(this.name ? this.name : PRIMARY_OUTLET);
  }

  get isActivated(): boolean {
    return !!this.activated;
  }
  get component(): Object {
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
    return this.activated.instance;
  }
  get activatedRoute(): ActivatedRoute {
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
    return this._activatedRoute;
  }

  detach(): ComponentRef<any> {
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
    this.location.detach();
    const r = this.activated;
    this.activated = null !;
    this._activatedRoute = null !;
    console.log('detached');
    return r;
  }

  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
    this.activated = ref;
    this._activatedRoute = activatedRoute;
    this.location.insert(ref.hostView);
    console.log('attached');
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;
      this.activated.destroy();
      this.activated = null !;
      this._activatedRoute = null !;
      this.deactivateEvents.emit(c);
    }
  }

  activateWith(
      activatedRoute: ActivatedRoute,
      resolver: ComponentFactoryResolver | null,
      outletMap: RouterOutletMap) {

    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }

    this.outletMap = outletMap;
    this._activatedRoute = activatedRoute;

    const snapshot = activatedRoute['_futureSnapshot'];
    const component = <any>snapshot._routeConfig !.component;

    resolver = resolver || this.resolver;
    const factory = resolver.resolveComponentFactory(component) !;

    const injector = new OutletInjector(activatedRoute, outletMap, this.location.injector);
    // this.activated = this.location.createComponent(factory, this.location.length, injector, []);

    // this.activated.changeDetectorRef.detectChanges();

    this.activateEvents.emit({ component, factory, injector });
    // this.activateEvents.emit(this.activated.instance);
  }
}

class OutletInjector implements Injector {
  constructor(
    private route: ActivatedRoute, private map: RouterOutletMap, private parent: Injector) {}

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === RouterOutletMap) {
      return this.map;
    }

    return this.parent.get(token, notFoundValue);
  }
}
