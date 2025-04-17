import { UserEntity } from '../entities/user.entity';
import {
  SearchableRepository,
  SearchParams,
  SearchResult,
} from '@/@core/base/searchable-repository.base';

type Filter = string;

export interface UserRepository
  extends SearchableRepository<
    UserEntity,
    Filter,
    SearchParams,
    SearchResult<UserEntity, Filter>
  > {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>;
}
