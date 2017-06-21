import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angle modules
import { TranslateModule } from '@ngx-translate/core';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { BsDropdownModule as DropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

// Angle directives
import { FlotDirective } from './directives/flot/flot.directive';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { EasypiechartDirective } from './directives/easypiechart/easypiechart.directive';
import { ColorsService } from './colors/colors.service';
import { CheckallDirective } from './directives/checkall/checkall.directive';
import { VectormapDirective } from './directives/vectormap/vectormap.directive';
import { NowDirective } from './directives/now/now.directive';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { RouterOutlet2Directive } from './directives/outlet2/router-outlet2.directive';

// App modules
// import { CalendarModule } from 'primeng/primeng';
import { ContentTabstripModule } from './components/content-tabstrip/content-tabstrip.module';
import { DatePickerModule } from './components/form/datepicker/datepicker.module';
// TODO: consider to dump in favour of angular2-text-mask
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';

// App directives
import { ActionDialogModule } from './components/dialog/action/action-dialog.module';
import { DynamicFormModule } from './components/form/dynamic-form/dynamic-form.module';
import { ImageUploadModule } from './components/form/image-upload/image-upload.module';
import { InfoDialogModule } from './components/dialog/info/info-dialog.module';
import { GridModule } from './components/grid/grid.module';
import { Grid2Module } from './components/grid2/grid2.module';
import { NumericInputComponent } from './components/form/numeric-input/numeric-input.component';
import { QBuilderComponent } from './components/qbuilder/qbuilder.component';
import { QBuilderService } from './components/qbuilder/qbuilder.service';
import { TabComponent } from './components/tabstrip/tab.component';
import { TabstripComponent } from './components/tabstrip/tabstrip.component';
import { TreeModule } from './components/flowtree/tree.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { Toolbar2Module } from './components/toolbar-2/toolbar-2.module';
import { IconsService } from './icons/icons.service';
import { DialogModule } from './components/dialog/dialog.module';
import { DialogActionModule } from './components/dialog-action/dialog-action.module';
import { MultiSelectModule } from './components/form/multi-select/multi-select.module';
import { TimeModule } from './components/form/time/time.module';
import { PopupInputModule } from './components/form/popup-input/popup-input.module';

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angle modules
    // CalendarModule,
    CurrencyMaskModule,
    DropdownModule.forRoot(),
    TranslateModule,
    ProgressbarModule.forRoot(),
    TextMaskModule,
    MultiSelectModule,
    // app modules
    ActionDialogModule,
    ContentTabstripModule,
    DatePickerModule,
    DialogActionModule,
    DynamicFormModule,
    ImageUploadModule,
    InfoDialogModule,
    GridModule,
    Grid2Module,
    MomentModule,
    PopupInputModule,
    ToasterModule,
    ToolbarModule,
    Toolbar2Module,
    TreeModule,
    TimeModule,
  ],
  providers: [
    ColorsService,
    IconsService,
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
    // app declarations
    RouterOutlet2Directive,
    TabComponent,
    TabstripComponent,
    NumericInputComponent,
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
    DropdownModule,
    // CalendarModule,
    TextMaskModule,
    ProgressbarModule,
    CheckallDirective,
    EasypiechartDirective,
    FlotDirective,
    NowDirective,
    ScrollableDirective,
    SparklineDirective,
    ToasterModule,
    VectormapDirective,
    // App exports
    ActionDialogModule,
    ContentTabstripModule,
    DatePickerModule,
    DialogActionModule,
    DynamicFormModule,
    DialogModule,
    ImageUploadModule,
    InfoDialogModule,
    GridModule,
    Grid2Module,
    MomentModule,
    MultiSelectModule,
    NumericInputComponent,
    PopupInputModule,
    QBuilderComponent,
    RouterOutlet2Directive,
    TabComponent,
    TabstripComponent,
    ToolbarModule,
    Toolbar2Module,
    TreeModule,
    TimeModule,
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
