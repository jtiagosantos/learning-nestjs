import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateOneBookInput } from '../interfaces/update-one-book.input.interface';

@Injectable()
export class UpdateOneBookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bookId: string, bookInput: UpdateOneBookInput) {
    const updatedBook = await this.prisma.book.update({
      data: {
        title: bookInput.title,
        description: bookInput.description,
        barCode: bookInput.barCode,
      },
      where: {
        id: bookId,
      },
    });

    return updatedBook;
  }
}
