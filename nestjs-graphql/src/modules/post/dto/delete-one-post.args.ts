import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class DeleteOnePostArgs {
  @Field()
  id: string;
}
