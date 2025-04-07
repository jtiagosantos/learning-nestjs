import { PartialType } from '@nestjs/swagger';
import { CreateCourseDTO } from './create-course.dto';

export class UpdateCourseDTO extends PartialType(CreateCourseDTO) {}
