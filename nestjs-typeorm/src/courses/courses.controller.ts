import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dtos/create-course.dto';
import { UpdateCourseDTO } from './dtos/update-course.dto';
import {
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Course with ID :id not found',
        error: 'Not Found',
        statusCode: 404,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        message: 'invalid input syntax for type uuid: ":id"',
        error: 'Unprocessable Entity',
        statusCode: 422,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Post()
  create(@Body() createCourseDTO: CreateCourseDTO) {
    return this.courseService.create(createCourseDTO);
  }

  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Course with ID :id not found',
        error: 'Not Found',
        statusCode: 404,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        message: 'invalid input syntax for type uuid: ":id"',
        error: 'Unprocessable Entity',
        statusCode: 422,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDTO: UpdateCourseDTO) {
    return this.courseService.update(id, updateCourseDTO);
  }

  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Course with ID :id not found',
        error: 'Not Found',
        statusCode: 404,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        message: 'invalid input syntax for type uuid: ":id"',
        error: 'Unprocessable Entity',
        statusCode: 422,
        path: '/courses/:id',
        timestamp: new Date().toISOString(),
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
