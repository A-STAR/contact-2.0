import { Field, FieldType } from '@app/core/repository/repository.utils';

export class User {

  @Field()
  agentId: number;

  @Field()
  agentName: string;

  @Field()
  agentPassword: string;

  @Field()
  branchCode: number;

  @Field()
  comment: string;

  @Field()
  email: string;

  @Field({ type: FieldType.DATE })
  endWorkDate: Date;

  @Field()
  firstName: string;

  @Field()
  hasPhoto: boolean;

  @Field({ primaryKey: true })
  id: number;

  @Field()
  intPhone: string;

  @Field({ type: FieldType.BOOLEAN })
  isAutoReset: boolean;

  @Field({ type: FieldType.BOOLEAN })
  isInactive: boolean;

  @Field()
  languageId: number;

  @Field()
  lastName: string;

  @Field()
  ldapLogin: string;

  @Field()
  login: string;

  @Field()
  middleName: string;

  @Field()
  mobPhone: string;

  @Field()
  organization: string;

  @Field()
  position: string;

  @Field()
  roleId: number;

  @Field({ type: FieldType.DATE })
  startWorkDate: Date;

  @Field()
  workAddress: string;

  @Field()
  workPhone: string;
}
