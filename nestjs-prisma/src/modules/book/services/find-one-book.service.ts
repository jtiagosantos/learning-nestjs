import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IFindOneBook } from '../interfaces/find-one-book.interface';

@Injectable()
export class FindOneBookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bookInput: IFindOneBook) {
    const book = await this.prisma.book.findFirst({
      where: {
        OR: {
          barCode: bookInput.barCode,
          id: bookInput.id,
        },
      },
    });

    return book;
  }
}
