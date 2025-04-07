import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDTO {
  @ApiProperty({
    description: 'The name of the course',
    example: 'Introduction to Programming',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The description of the course',
    example: 'This course covers the basics of programming using Javascript.',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'The tags associated with the course',
    example: ['programming', 'javascript', 'basics'],
    required: true,
    type: [String],
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty()
  readonly tags: string[];
}
