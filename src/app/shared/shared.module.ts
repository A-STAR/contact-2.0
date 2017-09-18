import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

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
import { RouterOutlet2Directive } from './directives/outlet2/router-outlet2.directive';

// App modules
import { AccordionModule } from './components/accordion/accordion.module';
import { ActionDialogModule } from './components/dialog/action/action-dialog.module';
import { AttachmentsModule } from './components/attachments/attachments.module';
import { BlockDialogModule } from './components/dialog/block/block-dialog.module';
import { ContentTabstripModule } from './components/content-tabstrip/content-tabstrip.module';
import { DatePickerModule } from './components/form/datepicker/datepicker.module';
import { DialogModule } from './components/dialog/dialog.module';
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
import { GuiObjectsModule } from './gui-objects/gui-objects.module';
import { HDividerModule } from './components/hdivider/hdivider.module';
import { ImageUploadModule } from './components/form/image-upload/image-upload.module';
import { InfoDialogModule } from './components/dialog/info/info-dialog.module';
import { ListModule } from './components/list/list.module';
import { MultiSelectModule } from './components/form/multi-select/multi-select.module';
import { PasswordModule } from './components/form/password/password.module';
import { PopupInputModule } from './components/form/popup-input/popup-input.module';
import { ProgressbarModule } from './components/progressbar/progressbar.module';
import { QBuilder2Module } from './components/qbuilder2/qbuilder2.module';
import { RadioGroupModule } from './components/form/radio-group/radio-group.module';
import { RichTextEditorModule } from './components/form/rich-text-editor/rich-text-editor.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { TabstripModule } from './components/tabstrip/tabstrip.module';
import { TimeModule } from './components/form/time/time.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { Toolbar2Module } from './components/toolbar-2/toolbar-2.module';
import { TreeModule } from './components/flowtree/tree.module';

import { IconsService } from './icons/icons.service';
import { QBuilderService } from './components/qbuilder/qbuilder.service';

import { NumericInputComponent } from './components/form/numeric-input/numeric-input.component';
import { QBuilderComponent } from './components/qbuilder/qbuilder.component';

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angle modules
    TranslateModule,
    TextMaskModule,
    MultiSelectModule,
    PerfectScrollbarModule,
    // app modules
    AccordionModule,
    ActionDialogModule,
    AttachmentsModule,
    BlockDialogModule,
    ContentTabstripModule,
    DatePickerModule,
    DialogActionModule,
    DownloaderModule,
    DropdownModule,
    DropdownInputModule,
    DynamicFormModule,
    DynamicForm2Module,
    FileUploadModule,
    GridModule,
    Grid2Module,
    GridTreeModule,
    GuiObjectsModule,
    HDividerModule,
    ImageUploadModule,
    InfoDialogModule,
    ListModule,
    PasswordModule,
    PopupInputModule,
    ProgressbarModule,
    QBuilder2Module,
    RadioGroupModule,
    RichTextEditorModule,
    SpinnerModule,
    TabstripModule,
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
    AttachmentsModule,
    BlockDialogModule,
    ContentTabstripModule,
    DatePickerModule,
    DialogActionModule,
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
    GuiObjectsModule,
    HDividerModule,
    ImageUploadModule,
    InfoDialogModule,
    ListModule,
    MultiSelectModule,
    NumericInputComponent,
    PasswordModule,
    PopupInputModule,
    ProgressbarModule,
    QBuilderComponent,
    QBuilder2Module,
    RadioGroupModule,
    RichTextEditorModule,
    RouterOutlet2Directive,
    SpinnerModule,
    TabstripModule,
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
