import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class FindOneAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(authorId: string) {
    const author = await this.prisma.author.findUnique({
      where: {
        id: authorId,
      },
    });

    return author;
  }
}
