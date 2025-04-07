import { randomUUID } from 'node:crypto';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dtos/create-course.dto';
import { UpdateCourseDTO } from './dtos/update-course.dto';

describe('CoursesService unit test', () => {
  let service: CoursesService;
  let id: string;
  let createdAt: Date;
  let expectOutputTags: any;
  let expectOutputCourses: any;
  let mockCourseRepository: any;
  let mockTagRepository: any;

  beforeEach(async () => {
    service = new CoursesService();
    id = randomUUID();
    createdAt = new Date();
    expectOutputTags = [
      {
        id,
        name: 'nestjs',
        created_at: createdAt,
      },
    ];
    expectOutputCourses = {
      id,
      name: 'nestjs',
      description: 'course of nestjs',
      tags: expectOutputTags,
      created_at: createdAt,
    };

    mockCourseRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      update: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      preload: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      find: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findOneBy: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectOutputCourses)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
    };

    mockTagRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagRepository;
  });

  it('should be able to find all courses', async () => {
    const courses = await service.findAll();

    expect(mockCourseRepository.find).toHaveBeenCalledTimes(1);
    expect(courses).toStrictEqual(expectOutputCourses);
  });

  it('should be able to find a specific course by id', async () => {
    const course = await service.findOne(id);

    expect(mockCourseRepository.findOne).toHaveBeenCalledTimes(1);
    expect(course).toStrictEqual(expectOutputCourses);
  });

  it('should be able to create a course', async () => {
    const createCourseDTO: CreateCourseDTO = {
      name: 'nestjs',
      description: 'course of nestjs',
      tags: ['nestjs'],
    };

    const newCourse = await service.create(createCourseDTO);

    expect(mockCourseRepository.save).toHaveBeenCalledTimes(1);
    expect(newCourse).toStrictEqual(expectOutputCourses);
  });

  it('should be able to update a course', async () => {
    const updateCourseDTO: UpdateCourseDTO = {
      name: 'nestjs',
      description: 'course of nestjs',
      tags: ['nestjs'],
    };

    const updatedCourse = await service.update(id, updateCourseDTO);

    expect(mockCourseRepository.preload).toHaveBeenCalledTimes(1);
    expect(mockCourseRepository.save).toHaveBeenCalledTimes(1);
    expect(updatedCourse).toStrictEqual(expectOutputCourses);
  });

  it('should be able to delete a specific course by id', async () => {
    const course = await service.remove(id);

    expect(mockCourseRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockCourseRepository.remove).toHaveBeenCalledTimes(1);
    expect(course).toStrictEqual(expectOutputCourses);
  });
});
