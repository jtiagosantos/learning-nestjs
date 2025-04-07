import 'dotenv/config';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { Tag } from './entities/tags.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CoursesModule } from './courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { randomUUID } from 'node:crypto';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let data: any;
  let dataSource: DataSource;

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5433,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Course, Tag],
    synchronize: true,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => ({
            ...dataSourceTest,
          }),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = await new DataSource(dataSourceTest).initialize();

    data = {
      name: 'nestjs',
      description: 'course of nestjs',
      tags: ['nestjs', 'typeorm'],
    };
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterEach(async () => {
    await dataSource.dropDatabase();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
    await app.close();
  });

  describe('POST /courses', () => {
    it('should be able to create a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(response.body).toEqual({
        name: 'nestjs',
        description: 'course of nestjs',
        tags: [
          {
            id: expect.any(String),
            name: 'nestjs',
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            name: 'typeorm',
            createdAt: expect.any(String),
          },
        ],
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });

  describe('GET /courses', () => {
    it('should be able to list all courses', async () => {
      await request(app.getHttpServer())
        .post('/courses')
        .send({
          name: 'nestjs',
          description: 'course of nestjs',
          tags: ['nestjs', 'typeorm'],
        });

      await request(app.getHttpServer())
        .post('/courses')
        .send({
          name: 'fastify',
          description: 'course of fastify',
          tags: ['fastify', 'typescript', 'nodejs'],
        });

      const response = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      //console.log(JSON.stringify(response.body, null, 2));

      response.body.forEach((course) => {
        expect(course).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          tags: expect.arrayContaining([
            {
              id: expect.any(String),
              name: expect.any(String),
              createdAt: expect.any(String),
            },
          ]),
          createdAt: expect.any(String),
        });
      });
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /courses/:id', () => {
    it('should be able to get a specific course by id', async () => {
      const createdCourseResponse = await request(app.getHttpServer())
        .post('/courses')
        .send({
          name: 'nestjs',
          description: 'course of nestjs',
          tags: ['nestjs', 'typeorm'],
        });

      const response = await request(app.getHttpServer()).get(
        `/courses/${createdCourseResponse.body.id}`,
      );

      expect(response.body).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        tags: [
          {
            id: expect.any(String),
            name: expect.any(String),
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            name: expect.any(String),
            createdAt: expect.any(String),
          },
        ],
        createdAt: expect.any(String),
      });
    });

    it('should not be able to get an inexistent course', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/courses/${id}`);

      expect(response.body).toEqual({
        message: `Course with ID ${id} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('PUT /courses/:id', () => {
    it('should be able to update a course', async () => {
      const createdCourseResponse = await request(app.getHttpServer())
        .post('/courses')
        .send({
          name: 'nestjs',
          description: 'course of nestjs',
          tags: ['nestjs', 'typeorm'],
        });

      const updateData = {
        name: 'new name',
        description: 'new description',
        tags: ['one', 'two', 'three'],
      };

      const response = await request(app.getHttpServer())
        .put(`/courses/${createdCourseResponse.body.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'new name',
        description: 'new description',
        tags: [
          {
            id: expect.any(String),
            name: 'one',
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            name: 'two',
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            name: 'three',
            createdAt: expect.any(String),
          },
        ],
        createdAt: expect.any(String),
      });
      expect(response.body.tags).toHaveLength(3);
    });

    it('should not be able to update an inexistent course', async () => {
      const updateData = {
        name: 'new name',
        description: 'new description',
        tags: ['one', 'two', 'three'],
      };
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .put(`/courses/${id}`)
        .send(updateData);

      expect(response.body).toEqual({
        message: `Course with ID ${id} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should be able to delete a course', async () => {
      const createdCourseResponse = await request(app.getHttpServer())
        .post('/courses')
        .send({
          name: 'nestjs',
          description: 'course of nestjs',
          tags: ['nestjs', 'typeorm'],
        });

      await request(app.getHttpServer())
        .delete(`/courses/${createdCourseResponse.body.id}`)
        .expect(204)
        .expect({});
    });

    it('should not be able to delete an inexistent course', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).delete(
        `/courses/${id}`,
      );

      expect(response.body).toEqual({
        message: `Course with ID ${id} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });
});
