export interface IScriptEditorMetadata {
  name: string;
  type?: number;
  desc?: string;
  children?: IScriptEditorMetadata[];
}

export interface IScriptEditorDef {
  [variable: string]: any;
}
