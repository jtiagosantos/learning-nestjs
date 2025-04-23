import { PaginationOutput } from '@/@core/outputs/pagination.output';
import { UserOutput } from './user.output';

export interface ListUsersOutput extends PaginationOutput<UserOutput> {}
