import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateOnePostInput } from '../dto/create-one-post.input';

@Injectable()
export class CreateOnePostService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(input: CreateOnePostInput) {
    const { title, votes, authorId } = input;

    const newPost = await this.prisma.post.create({
      data: {
        title,
        votes,
        authorId,
      },
    });

    return newPost;
  }
}
