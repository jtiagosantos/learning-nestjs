import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => Int, { defaultValue: 0 })
  votes?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
