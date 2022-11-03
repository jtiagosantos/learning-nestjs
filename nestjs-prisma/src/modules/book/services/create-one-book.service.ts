import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateOneBookInput } from '../interfaces/create-one-book-input.interface';

@Injectable()
export class CreateOneBookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bookInput: CreateOneBookInput) {
    const book = await this.prisma.book.create({
      data: {
        title: bookInput.title,
        description: bookInput.description,
        barCode: bookInput.barCode,
      },
    });

    return book;
  }
}
