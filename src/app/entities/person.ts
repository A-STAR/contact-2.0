import { Field, FieldType } from '@app/core/repository/repository.utils';

export class Person {
  @Field({ type: FieldType.DATE })
  birthDate: Date;
  @Field()
  birthPlace: string;
  @Field()
  comment: string;
  @Field()
  educationCode: number;
  @Field()
  familyStatusCode: number;
  @Field()
  firstName: string;
  @Field()
  genderCode: number;
  @Field({ primaryKey: true })
  id: number;
  @Field()
  lastName: string;
  @Field()
  middleName: string;
  @Field()
  personId: number;
  @Field()
  stageCode: number;
  @Field()
  stringValue1: string;
  @Field()
  stringValue2: string;
  @Field()
  stringValue3: string;
  @Field()
  stringValue4: string;
  @Field()
  stringValue5: string;
  @Field()
  stringValue6: string;
  @Field()
  stringValue7: string;
  @Field()
  stringValue8: string;
  @Field()
  stringValue9: string;
  @Field()
  stringValue10: string;
  @Field()
  typeCode: number;
}
