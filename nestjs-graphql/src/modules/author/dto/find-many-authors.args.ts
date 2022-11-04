import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindManyAuthorsArgs {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
