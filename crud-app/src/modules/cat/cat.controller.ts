import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catService.create(createCatDto);
  }

  @Get()
  findAll(): Array<Cat> {
    return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const cat = this.catService.findOne(id);

    if (cat) {
      return { cat };
    }

    throw new NotFoundException('Cat not found');
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    const catExists = this.catService.update(id, updateCatDto);

    if (catExists === null) {
      throw new NotFoundException('Cat not found');
    }

    return;
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    this.catService.deleteOne(id);
  }
}
