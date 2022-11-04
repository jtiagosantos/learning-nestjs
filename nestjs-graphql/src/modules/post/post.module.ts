import { Module } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { FindOneAuthorService } from '../author/services/find-one-author.service';
import { PostResolver } from './post.resolver';
import { CreateOnePostService } from './services/create-one-post.service';
import { DeleteOnePostService } from './services/delete-one-post.service';
import { FindManyPostsService } from './services/find-many-posts.service';
import { FindOnePostService } from './services/find-one-post.service';
import { UpdateOnePostService } from './services/update-one-post.service';

@Module({
  providers: [
    PostResolver,
    PrismaService,
    FindOnePostService,
    CreateOnePostService,
    FindOneAuthorService,
    FindManyPostsService,
    UpdateOnePostService,
    DeleteOnePostService,
  ],
})
export class PostModule {}
