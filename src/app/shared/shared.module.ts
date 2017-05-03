import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angle modules
import { TranslateModule } from '@ngx-translate/core';
// import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule as DropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

// Angle directives
import { FlotDirective } from './directives/flot/flot.directive';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { EasypiechartDirective } from './directives/easypiechart/easypiechart.directive';
import { ColorsService } from './colors/colors.service';
import { CheckallDirective } from './directives/checkall/checkall.directive';
import { VectormapDirective } from './directives/vectormap/vectormap.directive';
import { NowDirective } from './directives/now/now.directive';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { JqcloudDirective } from './directives/jqcloud/jqcloud.directive';

// App modules
import { CalendarModule } from 'primeng/primeng';
import { DatePickerModule } from './components/form/datepicker/datepicker.module';
// TODO: consider to dump in favour of angular2-text-mask
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';

// App directives
import { DialogComponent } from './components/dialog/dialog.component';
import { DynamicFormModule } from './components/form/dynamic-form/dynamic-form.module';
import { GridModule } from './components/grid/grid.module';
import { QBuilderComponent } from './components/qbuilder/qbuilder.component';
import { QBuilderService } from './components/qbuilder/qbuilder.service';
import { TabComponent } from './components/tabstrip/tab.component';
import { TabstripComponent } from './components/tabstrip/tabstrip.component';


// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angle modules
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CalendarModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    CurrencyMaskModule,
    DropdownModule.forRoot(),
    TranslateModule,
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    TextMaskModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    // app modules
    DatePickerModule,
    DynamicFormModule,
    GridModule,
    MomentModule,
  ],
  providers: [
    ColorsService,
    QBuilderService
  ],
  declarations: [
    FlotDirective,
    SparklineDirective,
    EasypiechartDirective,
    CheckallDirective,
    VectormapDirective,
    NowDirective,
    ScrollableDirective,
    JqcloudDirective,
    // app declarations
    TabComponent,
    TabstripComponent,
    DialogComponent,
    QBuilderComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    // Angle exports
    CurrencyMaskModule,
    AccordionModule,
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    DropdownModule,
    CalendarModule,
    TextMaskModule,
    PaginationModule,
    ProgressbarModule,
    RatingModule,
    TooltipModule,
    TypeaheadModule,
    CheckallDirective,
    EasypiechartDirective,
    FlotDirective,
    JqcloudDirective,
    NowDirective,
    ScrollableDirective,
    SparklineDirective,
    VectormapDirective,
    // App exports
    DatePickerModule,
    DialogComponent,
    DynamicFormModule,
    GridModule,
    MomentModule,
    QBuilderComponent,
    TabComponent,
    TabstripComponent,
  ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
