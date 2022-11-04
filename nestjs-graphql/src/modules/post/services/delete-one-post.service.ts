import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { DeleteOnePostArgs } from '../dto/delete-one-post.args';

@Injectable()
export class DeleteOnePostService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(args: DeleteOnePostArgs) {
    const { id } = args;

    await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
