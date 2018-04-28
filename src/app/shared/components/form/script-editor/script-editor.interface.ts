export interface IScriptEditorConfig {
  enableTern?: { defs: IScriptEditorDefs[], plugins: any };
  useWorker?: any;
  enableBasicAutocompletion?: boolean;
  enableSnippets?: any[];
}

export interface IScriptEditorDefs {
  [variable: string]: any;
}
