import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { PrismaService } from '@/database/prisma.service';
import { CreateOneBookService } from './services/create-one-book.service';
import { FindOneBookService } from './services/find-one-book.service';
import { FindManyBooksService } from './services/find-many-books.service';
import { UpdateOneBookService } from './services/update-one-book.service';
import { DeleteOneBookService } from './services/delete-one-book.service';

@Module({
  controllers: [BookController],
  providers: [
    PrismaService,
    CreateOneBookService,
    FindOneBookService,
    FindManyBooksService,
    UpdateOneBookService,
    DeleteOneBookService,
  ],
})
export class BookModule {}
