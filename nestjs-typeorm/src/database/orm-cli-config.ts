import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1743789212246 } from 'src/migrations/1743789212246-CreateCoursesTable';
import { CreateTagsTable1743790230659 } from 'src/migrations/1743790230659-CreateTagsTable';
import { CreateCoursesTagsTable1743791565489 } from 'src/migrations/1743791565489-CreateCoursesTagsTable';
import { AddCourseIdToCourseTagsTable1743792491257 } from 'src/migrations/1743792491257-AddCourseIdToCourseTagsTable';
import { AddTagIdToCoursesTagsTable1743803455841 } from 'src/migrations/1743803455841-AddTagIdToCoursesTagsTable';

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
