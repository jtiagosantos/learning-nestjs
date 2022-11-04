import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class FindManyPostsByAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(authorId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId,
      },
    });

    return posts;
  }
}
