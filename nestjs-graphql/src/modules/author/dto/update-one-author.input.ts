import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UpdateOneAuthorInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
