import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindManyBooksService {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const books = await this.prisma.book.findMany();

    return books;
  }
}
