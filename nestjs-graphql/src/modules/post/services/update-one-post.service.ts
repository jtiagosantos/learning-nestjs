import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UpdateOnePostInput } from '../dto/update-one-post.input';

@Injectable()
export class UpdateOnePostService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(input: UpdateOnePostInput) {
    const { id, title, votes } = input;

    const updatedPost = await this.prisma.post.update({
      data: {
        title,
        votes,
      },
      where: {
        id,
      },
    });

    return updatedPost;
  }
}
