import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UpdateOneAuthorInput } from '../dto/update-one-author.input';

@Injectable()
export class UpdateOneAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(input: UpdateOneAuthorInput) {
    const { id, firstName, lastName } = input;

    const updatedAuthor = await this.prisma.author.update({
      data: {
        firstName,
        lastName,
      },
      where: {
        id,
      },
    });

    return updatedAuthor;
  }
}
