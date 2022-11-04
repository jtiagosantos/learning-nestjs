import { NotFoundException } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { FindOneAuthorService } from '../author/services/find-one-author.service';
import { FindOnePostService } from './services/find-one-post.service';
import { FindManyPostsService } from './services/find-many-posts.service';
import { CreateOnePostService } from './services/create-one-post.service';
import { UpdateOnePostService } from './services/update-one-post.service';
import { DeleteOnePostService } from './services/delete-one-post.service';
import { CreateOnePostInput } from './dto/create-one-post.input';
import { UpdateOnePostInput } from './dto/update-one-post.input';
import { FindManyPostsArgs } from './dto/find-many-posts.args.input';
import { DeleteOnePostArgs } from './dto/delete-one-post.args';
import { Post } from './schema/post.schema';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly findOneAuthorService: FindOneAuthorService,
    private readonly findOnePostService: FindOnePostService,
    private readonly findManyPostsService: FindManyPostsService,
    private readonly createOnePostService: CreateOnePostService,
    private readonly updateOnePostService: UpdateOnePostService,
    private readonly deleteOnePostService: DeleteOnePostService,
  ) {}

  @Query(() => Post)
  async findOnePost(@Args('id') id: string) {
    const post = await this.findOnePostService.execute(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  @Query(() => [Post])
  async findManyPosts(@Args() args: FindManyPostsArgs) {
    const posts = await this.findManyPostsService.execute(args);

    return posts;
  }

  @Mutation(() => Post)
  async createOnePost(@Args() input: CreateOnePostInput) {
    const { authorId } = input;

    const authorExists = await this.findOneAuthorService.execute(authorId);

    if (!authorExists) {
      throw new NotFoundException('Author not found');
    }

    const newPost = await this.createOnePostService.execute(input);

    return newPost;
  }

  @Mutation(() => Post)
  async updateOnePost(@Args() input: UpdateOnePostInput) {
    const { id } = input;

    const postExists = await this.findOnePostService.execute(id);

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const updatedPost = await this.updateOnePostService.execute(input);

    return updatedPost;
  }

  @Mutation(() => Boolean)
  async deleteOnePost(@Args() args: DeleteOnePostArgs) {
    const { id } = args;

    const postExists = await this.findOnePostService.execute(id);

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    await this.deleteOnePostService.execute(args);

    return true;
  }
}
