import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCoursesTable1743789212246 } from 'src/migrations/1743789212246-CreateCoursesTable';
import { CreateTagsTable1743790230659 } from 'src/migrations/1743790230659-CreateTagsTable';
import { CreateCoursesTagsTable1743791565489 } from 'src/migrations/1743791565489-CreateCoursesTagsTable';
import { AddCourseIdToCourseTagsTable1743792491257 } from 'src/migrations/1743792491257-AddCourseIdToCourseTagsTable';
import { AddTagIdToCoursesTagsTable1743803455841 } from 'src/migrations/1743803455841-AddTagIdToCoursesTagsTable';
import { Course } from 'src/courses/entities/courses.entity';
import { Tag } from 'src/courses/entities/tags.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Course, Tag],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1743789212246,
    CreateTagsTable1743790230659,
    CreateCoursesTagsTable1743791565489,
    AddCourseIdToCourseTagsTable1743792491257,
    AddTagIdToCoursesTagsTable1743803455841,
  ],
});
