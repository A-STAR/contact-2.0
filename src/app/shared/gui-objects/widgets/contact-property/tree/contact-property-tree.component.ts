import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContactTreeNode } from '../contact-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { ITreeNode } from '../../../../components/flowtree/treenode/treenode.interface';

import { ContactPropertyService } from '../contact-property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-property-tree',
  templateUrl: './contact-property-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeComponent implements OnInit {
  contactType: number = null;
  contactTypeOptions = [];

  treeType: number = null;
  treeTypeOptions = [];

  selectedNode$ = new BehaviorSubject<IContactTreeNode>(null);

  private _nodes: ITreeNode[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPropertyService: ContactPropertyService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PAYMENT_STATUS,
        UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE,
      ])
      .subscribe(dictionaries => {
        this.initContactTypeSelect(dictionaries);
        this.initTreeTypeSelect(dictionaries);
        this.cdRef.markForCheck();
        this.fetch();
      });
  }

  get nodes(): ITreeNode[] {
    return this._nodes;
  }

  onContactTypeChange(selection: IOption[]): void {
    this.contactType = Number(selection[0].value);
    this.fetch();
  }

  onTreeTypeChange(selection: IOption[]): void {
    this.treeType = Number(selection[0].value);
    this.fetch();
  }

  onNodeMove(event: any): void {
    console.log(event);
  }

  onNodeSelect(event: any): void {
    console.log(event);
  }

  onNodeDoubleClick(event: any): void {
    console.log(event);
  }

  private initContactTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.contactTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_PAYMENT_STATUS];
    this.contactType = this.contactTypeOptions.length ? this.contactTypeOptions[0].value : null;
  }

  private initTreeTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.treeTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE];
    this.treeType = this.treeTypeOptions ? this.treeTypeOptions[0].value : null;
  }

  private fetch(): void {
    this.contactPropertyService.fetchAll(this.contactType, this.treeType).subscribe(nodes => {
      const root = { id: 0 };
      this._nodes = this.addParents([
        {
          ...root,
          children: this.convertToTreeNodes(nodes)
        }
      ]);
      this.cdRef.markForCheck();
    });
  }

  private convertToTreeNodes(nodes: IContactTreeNode[]): ITreeNode[] {
    return nodes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(node => {
        const { children, sortOrder, ...data } = node;
        return {
          data,
          ...(children && children.length ? { children: this.convertToTreeNodes(children) } : {}),
          sortOrder,
          label: String(node.id),
          // TODO(d.maltsev): switch back to name when there is valid data in the DB
          // label: node.name,
          bgColor: node.boxColor,
          id: node.id,
          expanded: true,
        };
      });
  }

  private addParents(nodes: ITreeNode[], parent: ITreeNode = null): ITreeNode[] {
    return nodes.map(node => {
      const { children } = node;
      return {
        ...node,
        ...(children && children.length ? { children: this.addParents(children, node) } : {}),
        parent,
      };
    });
  }
}
