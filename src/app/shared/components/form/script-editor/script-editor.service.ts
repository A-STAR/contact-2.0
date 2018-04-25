import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IScriptEditorMetadata, IScriptEditorDef } from './script-editor.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class ScriptEditorService {

  constructor(private userDictionariesService: UserDictionariesService) {
  }

  createScriptEditorDefs(metadata?: IScriptEditorMetadata[]): Observable<IScriptEditorDef[]> {
    return this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FORMULA_ATTRIBUTE_TYPE)
      .map(options => metadata.map(item => ({
        '!name': item.name,
        ...this.parseScriptEditorMetadata(item, options)
      })));
  }

  private parseScriptEditorMetadata(metadata: IScriptEditorMetadata, options: IOption[]): IScriptEditorDef {
    return ({
      [metadata.name]: {
        '!doc': `${metadata.type ? options.find(type => type.value === metadata.type).label : ''} ${metadata.desc}`,
        ...(metadata.children
          ? metadata.children.reduce((acc, child) => ({
            ...acc,
            ...this.parseScriptEditorMetadata(child, options)
          }), {})
          : {}
        )
      }
    });
  }
}
