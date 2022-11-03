import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOneBookDto } from './dto/create-one-book.dto';
import { UpdateOneBookDto } from './dto/update-one-book.dto';
import { CreateOneBookService } from './services/create-one-book.service';
import { DeleteOneBookService } from './services/delete-one-book.service';
import { FindManyBooksService } from './services/find-many-books.service';
import { FindOneBookService } from './services/find-one-book.service';
import { UpdateOneBookService } from './services/update-one-book.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly createOneBookService: CreateOneBookService,
    private readonly findOneBookService: FindOneBookService,
    private readonly findManyBooksService: FindManyBooksService,
    private readonly updateOneBookService: UpdateOneBookService,
    private readonly deleteOneBookService: DeleteOneBookService,
  ) {}

  @Post()
  async createOne(@Body() bookDto: CreateOneBookDto) {
    const bookExists = await this.findOneBookService.execute({
      barCode: bookDto.barCode,
    });

    if (!bookExists) {
      const book = await this.createOneBookService.execute({
        title: bookDto.title,
        description: bookDto.description,
        barCode: bookDto.barCode,
      });

      return book;
    }

    throw new ConflictException('Already exists a book with the same bar code');
  }

  @Get()
  async findMany() {
    const books = await this.findManyBooksService.execute();

    return books;
  }

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() bookDto: UpdateOneBookDto) {
    const bookExists = await this.findOneBookService.execute({
      id,
    });

    if (bookExists) {
      const updatedBook = await this.updateOneBookService.execute(id, {
        title: bookDto.title,
        description: bookDto.description,
        barCode: bookDto.barCode,
      });

      return updatedBook;
    }

    throw new NotFoundException('Book not found');
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const bookExists = await this.findOneBookService.execute({
      id,
    });

    if (bookExists) {
      await this.deleteOneBookService.execute(id);

      return { deleted: true };
    }

    throw new NotFoundException('Book not found');
  }
}
