export class ContextAutocomplete {

  private static ROOT_NODE = {
    name: 'root',
  };

  private utils: any;
  private nodes: any[];

  constructor(context: any[]) {
    this.utils = (<any>window).ace.require('ace/autocomplete/util');
    this.nodes = this.flattenNodes(this.mapParents(context, ContextAutocomplete.ROOT_NODE));
  }

  getNode(session: any, prefix: string, pos: any): any {
    const nodeName = this.utils.retrievePrecedingIdentifier(session.getLine(pos.row), pos.column - prefix.length - 1);
    return this.nodes.find(n => n.name === nodeName);
  }

  getCompleteNodes(node: any, prefix: string): any[] {
    const nodes = node && node.children ? node.children : this.nodes;
    return nodes.filter(n => !prefix || n.name.indexOf(prefix) !== -1);
  }

  getDocTooltip(item: any): string {
    return item.desc;
  }

  getCompletions(_: any, session: any, pos: any, prefix: any, callback: Function): void {
    const context = this.getNode(session, prefix, pos);
    const completeList = this.getCompleteNodes(context, prefix);
    callback(null, completeList.map(item => ({
      name: item.name,
      value: item.name,
      meta: item.parent.name,
      score: Number.MAX_VALUE,
      desc: item.desc
    })));
  }

  private mapParents(nodes: any[], parent: any): any[] {
    return nodes.map(node => node.children
      ? { ...node, children: this.mapParents(node.children, node), parent }
      : { ...node, parent }
    );
  }

  private flattenNodes(nodes: any[]): any[] {
    return nodes.reduce(
      (acc, node) => acc.concat(node.children ? [ node ].concat(this.flattenNodes(node.children)) : node),
      []
    );
  }
}
