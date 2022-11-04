import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FindManyPostsByAuthorService } from '../post/services/find-many-posts-by-author.service';
import { FindOneAuthorService } from './services/find-one-author.service';
import { FindManyAuthorsService } from './services/find-many-authors.service';
import { CreateOneAuthorService } from './services/create-one-author.service';
import { UpdateOneAuthorService } from './services/update-one-author.service';
import { DeleteOneAuthorService } from './services/delete-one-author.service';
import { CreateOneAuthorInput } from './dto/create-one-author.input';
import { UpdateOneAuthorInput } from './dto/update-one-author.input';
import { FindManyAuthorsArgs } from './dto/find-many-authors.args';
import { DeleteOneAuthorArgs } from './dto/delete-one-author.args';
import { Author } from './schema/author.schema';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    private readonly findManyPostsByAuthorService: FindManyPostsByAuthorService,
    private readonly findOneAuthorService: FindOneAuthorService,
    private readonly findManyAuthorsService: FindManyAuthorsService,
    private readonly createOneAuthorService: CreateOneAuthorService,
    private readonly updateOneAuthorService: UpdateOneAuthorService,
    private readonly deleteOneAuthorSerivce: DeleteOneAuthorService,
  ) {}

  @Query(() => Author)
  async findOneAuthor(@Args('id') id: string) {
    const author = await this.findOneAuthorService.execute(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  @Query(() => [Author])
  async findManyAuthors(@Args() args: FindManyAuthorsArgs) {
    const authors = await this.findManyAuthorsService.execute(args);

    return authors;
  }

  @Mutation(() => Author)
  async createOneAuthor(@Args() input: CreateOneAuthorInput) {
    const newAuthor = await this.createOneAuthorService.execute(input);

    return newAuthor;
  }

  @Mutation(() => Author)
  async updateOneAuthor(@Args() input: UpdateOneAuthorInput) {
    const { id } = input;

    const authorExists = await this.findOneAuthorService.execute(id);

    if (!authorExists) {
      throw new NotFoundException('Author not found');
    }

    const updatedAuthor = await this.updateOneAuthorService.execute(input);

    return updatedAuthor;
  }

  @Mutation(() => Boolean)
  async deleteOneAuthor(@Args() args: DeleteOneAuthorArgs) {
    const { id } = args;

    const authorExists = await this.findOneAuthorService.execute(id);

    if (!authorExists) {
      throw new NotFoundException('Author not found');
    }

    await this.deleteOneAuthorSerivce.execute(args);

    return true;
  }

  @ResolveField()
  async posts(@Parent() author: Author) {
    const { id } = author;

    const posts = await this.findManyPostsByAuthorService.execute(id);

    return posts;
  }
}
