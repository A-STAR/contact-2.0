import { Field, FieldType } from '@app/core/repository/repository.utils';

export class Phone {
  @Field()
  comment: string;
  @Field({ primaryKey: true })
  id: number;
  @Field({ type: FieldType.DATETIME })
  inactiveDateTime: Date;
  @Field()
  inactiveReasonCode: number;
  @Field({ type: FieldType.BOOLEAN })
  isInactive: boolean;
  @Field()
  phone: string;
  @Field()
  phoneInternational: string;
  @Field()
  statusCode: number;
  @Field()
  stopAutoInfo: number;
  @Field()
  stopAutoSms: number;
  @Field()
  typeCode: number;
}
