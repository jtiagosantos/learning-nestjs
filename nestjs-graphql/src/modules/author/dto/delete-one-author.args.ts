import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class DeleteOneAuthorArgs {
  @Field()
  id: string;
}
