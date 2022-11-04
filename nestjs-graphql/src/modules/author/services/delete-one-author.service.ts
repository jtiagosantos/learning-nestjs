import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { DeleteOneAuthorArgs } from '../dto/delete-one-author.args';

@Injectable()
export class DeleteOneAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(args: DeleteOneAuthorArgs) {
    const { id } = args;

    await this.prisma.author.delete({
      where: {
        id,
      },
    });
  }
}
