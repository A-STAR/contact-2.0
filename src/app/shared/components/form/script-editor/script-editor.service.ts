import { Injectable } from '@angular/core';

import { IScriptEditorMetadata, IScriptEditorDef } from './script-editor.interface';

@Injectable()
export class ScriptEditorService {

  createScriptEditorDefs(metadata?: IScriptEditorMetadata[]): IScriptEditorDef[] {
    return metadata.map(item => ({
      '!name': item.name,
      ...this.parseScriptEditorMetadata(item)
    }));
  }

  private parseScriptEditorMetadata(metadata: IScriptEditorMetadata): IScriptEditorDef {
    return {
      [metadata.name]: {
        '!doc': metadata.desc,
        ...(metadata.children
          ? metadata.children.reduce((acc, child) => ({
            ...acc,
            ...this.parseScriptEditorMetadata(child)
          }), {})
          : {}
        )
      }
    };
  }
}
