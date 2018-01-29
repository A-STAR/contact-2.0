import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AngularSplitModule } from 'angular-split';

// Angle modules
import { TranslateModule } from '@ngx-translate/core';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';

// Angle directives
import { FlotDirective } from './directives/flot/flot.directive';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { EasypiechartDirective } from './directives/easypiechart/easypiechart.directive';
import { ColorsService } from './colors/colors.service';
import { CheckallDirective } from './directives/checkall/checkall.directive';
import { VectormapDirective } from './directives/vectormap/vectormap.directive';
import { NowDirective } from './directives/now/now.directive';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';

// App modules
import { AccordionModule } from './components/accordion/accordion.module';
import { ActionDialogModule } from './components/dialog/action/action-dialog.module';
import { ActionGridModule } from './components/action-grid/action-grid.module';
import { BlockDialogModule } from './components/dialog/block/block-dialog.module';
import { ButtonModule } from './components/button/button.module';
import { ColorPickerModule } from './components/form/colorpicker/colorpicker.module';
import { DatePickerModule } from './components/form/datepicker/datepicker.module';
import { DateTimePickerModule } from './components/form/datetimepicker/datetimepicker.module';
import { DebtAmountModule } from './components/form/debt-amount/debt-amount.module';
import { DialogModule } from './components/dialog/dialog.module';
import { DialogMultiSelectModule } from './components/form/dialog-multi-select/dialog-multi-select.module';
import { DialogActionModule } from './components/dialog-action/dialog-action.module';
import { DownloaderModule } from './components/downloader/downloader.module';
import { DropdownModule } from './components/dropdown/dropdown.module';
import { DropdownInputModule } from './components/form/dropdown/dropdown-input.module';
import { DynamicFormModule } from './components/form/dynamic-form/dynamic-form.module';
import { DynamicForm2Module } from './components/form/dynamic-form-2/dynamic-form-2.module';
import { FileUploadModule } from './components/form/file-upload/file-upload.module';
import { GridModule } from './components/grid/grid.module';
import { Grid2Module } from './components/grid2/grid2.module';
import { GridTreeModule } from './components/gridtree/gridtree.module';
import { GridTreeWrapperModule } from './components/gridtree-wrapper/gridtree-wrapper.module';
import { GuiObjectsModule } from './gui-objects/gui-objects.module';
import { HDividerModule } from './components/hdivider/hdivider.module';
import { HtmlTextareaModule } from './components/form/html-textarea/html-textarea.module';
import { ImageUploadModule } from './components/form/image-upload/image-upload.module';
import { InfoDialogModule } from './components/dialog/info/info-dialog.module';
import { ListModule } from './components/list/list.module';
import { MetadataGridModule } from './components/metadata-grid/metadata-grid.module';
import { MultiLanguageModule } from './components/form/multi-language/multi-language.module';
import { MultiSelectModule } from './components/form/multi-select/multi-select.module';
import { PasswordModule } from './components/form/password/password.module';
import { PopupInputModule } from './components/form/popup-input/popup-input.module';
import { ProgressbarModule } from './components/progressbar/progressbar.module';
import { QBuilder2Module } from './components/qbuilder2/qbuilder2.module';
import { RadioGroupModule } from './components/form/radio-group/radio-group.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { TabstripModule } from './components/tabstrip/tabstrip.module';
import { TabViewModule } from './components/layout/tabview/tabview.module';
import { TextEditorModule } from './components/form/text-editor/text-editor.module';
import { TimeModule } from './components/form/time/time.module';
import { TimePickerModule } from './components/form/timepicker/timepicker.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { Toolbar2Module } from './components/toolbar-2/toolbar-2.module';
import { TreeModule } from './components/flowtree/tree.module';
import { ValueInputModule } from './components/form/value/value.module';
import { ViewFormModule } from './components/form/view-form/view-form.module';

import { QBuilderService } from './components/qbuilder/qbuilder.service';

import { NumericInputComponent } from './components/form/numeric-input/numeric-input.component';
import { QBuilderComponent } from './components/qbuilder/qbuilder.component';

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Third Party Modules
    AngularSplitModule,
    TranslateModule,
    TextMaskModule,
    PerfectScrollbarModule,
    // App Modules
    AccordionModule,
    ActionDialogModule,
    ActionGridModule,
    BlockDialogModule,
    ButtonModule,
    ColorPickerModule,
    DatePickerModule,
    DateTimePickerModule,
    DebtAmountModule,
    DialogActionModule,
    DialogMultiSelectModule,
    DownloaderModule,
    DropdownModule,
    DropdownInputModule,
    DynamicFormModule,
    DynamicForm2Module,
    FileUploadModule,
    GridModule,
    Grid2Module,
    GridTreeModule,
    GridTreeWrapperModule,
    GuiObjectsModule,
    HDividerModule,
    HtmlTextareaModule,
    ImageUploadModule,
    InfoDialogModule,
    ListModule,
    MetadataGridModule,
    MultiLanguageModule,
    MultiSelectModule,
    PasswordModule,
    PopupInputModule,
    ProgressbarModule,
    QBuilder2Module,
    RadioGroupModule,
    SpinnerModule,
    TabstripModule,
    TabViewModule,
    TextEditorModule,
    ToasterModule,
    ToolbarModule,
    Toolbar2Module,
    TreeModule,
    TimeModule,
    TimePickerModule,
    ValueInputModule,
    ViewFormModule,
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
    // App Components
    NumericInputComponent,
    QBuilderComponent
  ],
  exports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Third Party Modules
    AngularSplitModule,
    TranslateModule,
    // Angle exports
    TextMaskModule,
    CheckallDirective,
    EasypiechartDirective,
    FlotDirective,
    NowDirective,
    PerfectScrollbarModule,
    ScrollableDirective,
    SparklineDirective,
    ToasterModule,
    VectormapDirective,
    // App exports
    AccordionModule,
    ActionDialogModule,
    ActionGridModule,
    BlockDialogModule,
    ButtonModule,
    ColorPickerModule,
    DatePickerModule,
    DateTimePickerModule,
    DebtAmountModule,
    DialogActionModule,
    DialogMultiSelectModule,
    DownloaderModule,
    DropdownModule,
    DropdownInputModule,
    DynamicFormModule,
    DynamicForm2Module,
    DialogModule,
    FileUploadModule,
    GridModule,
    Grid2Module,
    GridTreeModule,
    GridTreeWrapperModule,
    GuiObjectsModule,
    HDividerModule,
    HtmlTextareaModule,
    ImageUploadModule,
    InfoDialogModule,
    ListModule,
    MetadataGridModule,
    MultiLanguageModule,
    MultiSelectModule,
    NumericInputComponent,
    PasswordModule,
    PopupInputModule,
    ProgressbarModule,
    QBuilderComponent,
    QBuilder2Module,
    RadioGroupModule,
    SpinnerModule,
    TabstripModule,
    TabViewModule,
    TextEditorModule,
    ToolbarModule,
    Toolbar2Module,
    TreeModule,
    TimeModule,
    TimePickerModule,
    ValueInputModule,
    ViewFormModule,
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
