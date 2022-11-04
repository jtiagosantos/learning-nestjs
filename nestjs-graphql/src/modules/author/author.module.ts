import { Module } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { FindManyPostsByAuthorService } from '../post/services/find-many-posts-by-author.service';
import { AuthorResolver } from './author.resolver';
import { CreateOneAuthorService } from './services/create-one-author.service';
import { DeleteOneAuthorService } from './services/delete-one-author.service';
import { FindManyAuthorsService } from './services/find-many-authors.service';
import { FindOneAuthorService } from './services/find-one-author.service';
import { UpdateOneAuthorService } from './services/update-one-author.service';

@Module({
  providers: [
    AuthorResolver,
    PrismaService,
    FindManyPostsByAuthorService,
    FindOneAuthorService,
    FindManyAuthorsService,
    CreateOneAuthorService,
    UpdateOneAuthorService,
    DeleteOneAuthorService,
  ],
})
export class AuthorModule {}
