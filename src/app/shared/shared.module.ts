import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Third-party modules
import { AngularSplitModule } from 'angular-split';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TextMaskModule } from 'angular2-text-mask';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { TranslateModule } from '@ngx-translate/core';

import { NowDirective } from './directives/now/now.directive';

// App modules
import { AccordionModule } from './components/accordion/accordion.module';
import { ActionDialogModule } from './components/dialog/action/action-dialog.module';
import { ActionDropdownModule } from '@app/shared/components/action-dropdown/action-dropdown.module';
import { ActionGridModule } from './components/action-grid/action-grid.module';
import { AreaModule } from './components/layout/area/area.module';
import { BlockDialogModule } from './components/dialog/block/block-dialog.module';
import { ButtonModule } from './components/button/button.module';
import { CapitalizeModule } from './pipes/capitalize/capitalize.module';
import { ChartsModule } from './components/charts/charts.module';
import { CheckModule } from './components/form/check/check.module';
import { ColorPickerModule } from './components/form/colorpicker/colorpicker.module';
import { DateTimeModule } from './components/form/datetime/datetime.module';
import { DebtAmountModule } from './components/form/debt-amount/debt-amount.module';
import { DialogModule } from './components/dialog/dialog.module';
import { DialogMultiSelectModule } from './components/form/dialog-multi-select/dialog-multi-select.module';
import { DialogActionModule } from './components/dialog-action/dialog-action.module';
import { DictionaryModule } from './pipes/dictionary/dictionary.module';
import { DownloaderModule } from './components/downloader/downloader.module';
import { DropdownModule } from './components/dropdown/dropdown.module';
import { DropdownInputModule } from './components/form/dropdown/dropdown-input.module';
import { DynamicFormModule } from './components/form/dynamic-form/dynamic-form.module';
import { DynamicForm2Module } from './components/form/dynamic-form-2/dynamic-form-2.module';
import { FileUploadModule } from './components/form/file-upload/file-upload.module';
import { GridModule } from './components/grid/grid.module';
import { Grid2Module } from './components/grid2/grid2.module';
import { GridsModule } from './components/grids/grids.module';
import { GridTree2Module } from './components/gridtree2/gridtree2.module';
import { GridTree2WrapperModule } from './components/gridtree2-wrapper/gridtree2-wrapper.module';
import { HDividerModule } from './components/hdivider/hdivider.module';
import { HtmlTextareaModule } from './components/form/html-textarea/html-textarea.module';
import { ImageUploadModule } from './components/form/image-upload/image-upload.module';
import { InfoDialogModule } from './components/dialog/info/info-dialog.module';
import { InputModule } from './components/form/input/input.module';
import { ListModule } from './components/list/list.module';
import { MapModule } from './components/map/map.module';
import { MassOpsModule } from './mass-ops/mass-ops.module';
import { MenuModule } from './components/form/menu/menu.module';
import { MomentModule } from './pipes/moment/moment.module';
import { MultiLanguageModule } from './components/form/multilanguage/multilanguage.module';
import { OperatorModule } from './components/operator/operator.module';
import { PopupInputModule } from './components/form/popup-input/popup-input.module';
import { PopupOutletModule } from './components/popup-outlet/popup-outlet.module';
import { ProgressbarModule } from './components/progressbar/progressbar.module';
import { QBuilder2Module } from './components/qbuilder2/qbuilder2.module';
import { RadioGroupModule } from './components/form/radio-group/radio-group.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { SelectModule } from './components/form/select/select.module';
import { ScriptEditorModule } from './components/form/script-editor/script-editor.module';
import { TabViewModule } from './components/layout/tabview/tabview.module';
import { TaskResultModule } from '@app/shared/components/task/task-result.module';
import { TextEditorModule } from './components/form/text-editor/text-editor.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { TreeModule } from './components/flowtree/tree.module';
import { ValueInputModule } from './components/form/value/value.module';
import { ViewFormModule } from './components/form/view-form/view-form.module';

import { QBuilderService } from './components/qbuilder/qbuilder.service';

import { NumericInputComponent } from './components/form/numeric-input/numeric-input.component';
import { QBuilderComponent } from './components/qbuilder/qbuilder.component';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Third Party Modules
    AngularSplitModule,
    PerfectScrollbarModule,
    TextMaskModule,
    ToasterModule,
    TranslateModule,
    // App Modules
    AccordionModule,
    ActionDialogModule,
    ActionDropdownModule,
    ActionGridModule,
    AreaModule,
    BlockDialogModule,
    ButtonModule,
    CapitalizeModule,
    ChartsModule,
    CheckModule,
    ColorPickerModule,
    DateTimeModule,
    DebtAmountModule,
    DialogActionModule,
    DialogMultiSelectModule,
    DictionaryModule,
    DownloaderModule,
    DropdownInputModule,
    DropdownModule,
    DynamicForm2Module,
    DynamicFormModule,
    DynamicLayoutModule,
    FileUploadModule,
    Grid2Module,
    GridModule,
    GridTree2Module,
    GridTree2WrapperModule,
    GridsModule,
    HDividerModule,
    HtmlTextareaModule,
    ImageUploadModule,
    InfoDialogModule,
    InputModule,
    ListModule,
    MapModule,
    MassOpsModule,
    MenuModule,
    MomentModule,
    MultiLanguageModule,
    OperatorModule,
    PopupInputModule,
    PopupOutletModule,
    ProgressbarModule,
    QBuilder2Module,
    RadioGroupModule,
    ScriptEditorModule,
    SelectModule,
    SpinnerModule,
    TabViewModule,
    TaskResultModule,
    TextEditorModule,
    ToolbarModule,
    TreeModule,
    ValueInputModule,
    ViewFormModule,
  ],
  providers: [
    QBuilderService
  ],
  declarations: [
    NowDirective,
    // App Components
    NumericInputComponent,
    QBuilderComponent,
  ],
  exports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Third Party Modules
    AngularSplitModule,
    PerfectScrollbarModule,
    TextMaskModule,
    ToasterModule,
    TranslateModule,
    // Angle exports
    NowDirective,
    // App exports
    AccordionModule,
    ActionDialogModule,
    ActionDropdownModule,
    ActionGridModule,
    AreaModule,
    BlockDialogModule,
    ButtonModule,
    CapitalizeModule,
    ChartsModule,
    CheckModule,
    ColorPickerModule,
    DateTimeModule,
    DebtAmountModule,
    DialogActionModule,
    DialogModule,
    DialogMultiSelectModule,
    DictionaryModule,
    DownloaderModule,
    DropdownInputModule,
    DropdownModule,
    DynamicForm2Module,
    DynamicFormModule,
    DynamicLayoutModule,
    FileUploadModule,
    Grid2Module,
    GridModule,
    GridTree2Module,
    GridTree2WrapperModule,
    GridsModule,
    HDividerModule,
    HtmlTextareaModule,
    ImageUploadModule,
    InfoDialogModule,
    InputModule,
    ListModule,
    MapModule,
    MassOpsModule,
    MenuModule,
    MomentModule,
    MultiLanguageModule,
    NumericInputComponent,
    OperatorModule,
    PopupInputModule,
    PopupOutletModule,
    ProgressbarModule,
    QBuilder2Module,
    QBuilderComponent,
    RadioGroupModule,
    ScriptEditorModule,
    SelectModule,
    SpinnerModule,
    TabViewModule,
    TaskResultModule,
    TextEditorModule,
    ToolbarModule,
    TreeModule,
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
