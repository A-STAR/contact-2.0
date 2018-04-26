import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class TemplateService {
  templates: Record<string, TemplateRef<any>>;

  init(templates: Record<string, TemplateRef<any>>): void {
    this.templates = templates;
  }
}
