import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { IOption } from '@app/core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { ContactPropertyService } from '../contact-properties.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd, doOnceIf } from '@app/core/utils/helpers';
import { isEmpty } from '@app/core/utils';
import { toTreeNodes } from '@app/core/utils/tree';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-contact-property-tree',
  templateUrl: './contact-property-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeComponent extends DialogFunctions implements OnInit, OnDestroy {
  contactType: number = null;
  contactTypeOptions = [];

  treeType: number = null;
  treeTypeOptions = [];

  copiedNode$ = new BehaviorSubject<{ node: ITreeNode, contactType: number, treeType: number }>(null);
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      action: () => this.setDialog('add'),
      enabled: this.canAdd$,
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.setDialog('edit'),
      enabled: this.canEdit$,
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('delete'),
      enabled: this.canDelete$,
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
    },
  ];

  dialog: 'add' | 'edit' | 'delete';

  private _nodes: ITreeNode[];
  private treeParamsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
    private contactPropertyService: ContactPropertyService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.treeParamsSub = combineLatest(
      this.userConstantsService.get('ContactTree.ContactType.List'),
      this.userDictionariesService
        .getDictionariesAsOptions([
          UserDictionariesService.DICTIONARY_CONTACT_TYPE,
          UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE,
        ])
    )
    .subscribe(([ contactType, dictionaries ]) => {
      this.initContactTypeSelect(dictionaries, contactType);
      this.initTreeTypeSelect(dictionaries);
      this.cdRef.markForCheck();
      this.fetch();
    });
  }

  ngOnDestroy(): void {
    this.treeParamsSub.unsubscribe();
  }

  get nodes(): ITreeNode[] {
    return this._nodes;
  }

  get hasCopiedNode$(): Observable<boolean> {
    return this.copiedNode$.map(Boolean);
  }

  get selectedNodeId$(): Observable<number> {
    return this.selectedNode$.map(node => node && node.id);
  }

  get canCopy$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_TREE_COPY');
  }

  onContactTypeChange(contactType: number): void {
    this.contactType = Number(contactType);
    this.fetch();
  }

  onTreeTypeChange(treeType: number): void {
    this.treeType = Number(treeType);
    this.fetch();
  }

  onNodeMove(event: any): void {
    const { parentId, sortOrder, id } = event;
    const data = { parentId, sortOrder };
    this.contactPropertyService.update(this.contactType, this.treeType, id, data)
      .subscribe(() => this.onSuccess());
  }

  onNodeSelect(event: { node: ITreeNode }): void {
    this.selectedNode$.next(event.node);
  }

  onNodeDoubleClick(node: ITreeNode): void {
    this.selectedNode$.next(node);
    doOnceIf(this.canEdit$, () => this.setDialog('edit'));
  }

  onNodeCopy(node: ITreeNode): void {
    this.copiedNode$.next({ node, contactType: this.contactType, treeType: this.treeType });
  }

  onNodePaste(node: ITreeNode): void {
    const copiedNode = this.copiedNode$.value;
    this.contactPropertyService.paste(
      copiedNode.contactType,
      copiedNode.treeType,
      copiedNode.node.id,
      node.id,
      !isEmpty(copiedNode.node.children)
    )
    .subscribe(() => this.onSuccess());
  }

  onAddDialogSubmit(data: any): void {
    this.contactPropertyService.create(this.contactType, this.treeType, data)
      .subscribe(() => this.onSuccess());
  }

  onEditDialogSubmit(data: any): void {
    this.contactPropertyService.update(this.contactType, this.treeType, this.selectedNode$.value.id, data)
      .subscribe(() => this.onSuccess());
  }

  onDeleteDialogSubmit(): void {
    this.contactPropertyService.delete(this.contactType, this.treeType, this.selectedNode$.value.id)
      .subscribe(() => this.onSuccess(true));
  }

  private initContactTypeSelect(dictionaries: { [key: number]: IOption[] }, types: IUserConstant): void {
    this.contactTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_TYPE]
      .filter(option => types.valueS === 'ALL' || types.valueS.split(',').includes(String(option.value)));
    this.contactType = this.contactTypeOptions.length ? this.contactTypeOptions[0].value : null;
  }

  private initTreeTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.treeTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE];
    this.treeType = this.treeTypeOptions ? this.treeTypeOptions[0].value : null;
  }

  private fetch(): void {
    if (this.contactType && this.treeType) {
      this.contactPropertyService.fetchAll(this.contactType, this.treeType)
        .map(toTreeNodes(false, true))
        .subscribe(nodes => {
          this._nodes = nodes;
          this.cdRef.markForCheck();
        });
    }
  }

  private get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_TREE_ADD');
  }

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('CONTACT_TREE_EDIT'),
      this.selectedNode$.map(Boolean),
    ]);
  }

  private get canDelete$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('CONTACT_TREE_DELETE'),
      this.selectedNode$.map(node => node && isEmpty(node.children)),
    ]);
  }

  private onSuccess(clearSelection: boolean = false): void {
    if (clearSelection) {
      this.selectedNode$.next(null);
    }
    this.fetch();
    this.closeDialog();
  }
}
