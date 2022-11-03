import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteOneBookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bookId: string) {
    await this.prisma.book.delete({
      where: {
        id: bookId,
      },
    });
  }
}
