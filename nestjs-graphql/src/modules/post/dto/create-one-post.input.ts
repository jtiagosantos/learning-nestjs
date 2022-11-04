import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CreateOnePostInput {
  @Field()
  title: string;

  @Field(() => Int, { defaultValue: 0 })
  votes: number;

  @Field()
  authorId: string;
}
