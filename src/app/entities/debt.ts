import { Field, FieldType } from '@app/core/repository/repository.utils';

export class Debt {
  @Field()
  account: string;
  @Field()
  bankId: number;
  @Field()
  branchCode: number;
  @Field()
  comment: string;
  @Field()
  contract: string;
  @Field({ type: FieldType.DATETIME })
  creditEndDate: Date;
  @Field()
  creditName: string;
  @Field({ type: FieldType.DATETIME })
  creditStartDate: Date;
  @Field()
  creditTypeCode: number;
  @Field()
  currencyId: number;
  @Field()
  debtAmount: number;
  @Field({ type: FieldType.DATE })
  debtDate: string;
  @Field()
  debtReasonCode: number;
  @Field()
  dict1Code: number;
  @Field()
  dict2Code: number;
  @Field()
  dict3Code: number;
  @Field()
  dict4Code: number;
  @Field()
  dpd: number;
  @Field({ primaryKey: true })
  id: number;
  @Field()
  personId: number;
  @Field()
  portfolioId: number;
  @Field()
  regionCode: number;
  @Field()
  responsibleId: number;
  @Field()
  responsibleFirstName: string;
  @Field()
  responsibleFullName: string;
  @Field()
  responsibleMiddleName: string;
  @Field()
  responsibleLastName: string;
  @Field()
  shortInfo: string;
  @Field()
  stageCode: number;
  @Field({ type: FieldType.DATETIME })
  startDate: Date;
  @Field()
  statusCode: number;
  @Field()
  timeZone: string;
  @Field()
  totalAmount: number;
  @Field()
  utc: string;
}
