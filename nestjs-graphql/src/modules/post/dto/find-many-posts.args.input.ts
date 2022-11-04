import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindManyPostsArgs {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  votes?: number;
}
