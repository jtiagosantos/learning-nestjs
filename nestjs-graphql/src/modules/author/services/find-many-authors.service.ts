import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { FindManyAuthorsArgs } from '../dto/find-many-authors.args';

@Injectable()
export class FindManyAuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(args: FindManyAuthorsArgs) {
    const { firstName, lastName } = args;

    const authors = await this.prisma.author.findMany({
      where: {
        firstName,
        lastName,
      },
    });

    return authors;
  }
}
