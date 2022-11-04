import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateOneAuthorInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
