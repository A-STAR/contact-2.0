import { Injectable } from '@angular/core';

@Injectable()
export class PledgerService {

  private attrListConstants: { [key: string]: string } = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };

  getAttributeConstant(typeCode: number): string {
    return this.attrListConstants[typeCode];
  }
}
