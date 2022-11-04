import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateOnePostInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  votes?: number;
}
