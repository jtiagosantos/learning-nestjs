import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateOneAuthorInput } from '../dto/create-one-author.input';

@Injectable()
export class CreateOneAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(input: CreateOneAuthorInput) {
    const { firstName, lastName } = input;

    const newAuthor = await this.prisma.author.create({
      data: {
        firstName,
        lastName,
      },
    });

    return newAuthor;
  }
}
