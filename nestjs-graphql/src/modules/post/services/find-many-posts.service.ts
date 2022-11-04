import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { FindManyPostsArgs } from '../dto/find-many-posts.args.input';

@Injectable()
export class FindManyPostsService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(args: FindManyPostsArgs) {
    const { title, votes } = args;

    const posts = await this.prisma.post.findMany({
      where: {
        title,
        votes,
      },
    });

    return posts;
  }
}
