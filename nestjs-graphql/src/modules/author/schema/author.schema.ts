import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/modules/post/schema/post.schema';

@ObjectType()
export class Author {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => [Post])
  posts: Post[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
