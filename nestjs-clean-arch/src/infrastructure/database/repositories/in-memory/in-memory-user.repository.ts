import { SortDirection } from '@/@core/base/searchable-repository.base';
import { ConflictError } from '@/@core/errors/conflict.error';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { InMemorySearchableRepository } from '@/@core/repositories/in-memory-searchable.repository';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

export class InMemoryUserRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  searchableFields = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.data.find(item => item.email === email);

    if (!entity) {
      throw new EntityNotFoundError(`Entity with email ${email} not found`);
    }

    return entity;
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.data.find(item => item.email === email);

    if (entity) {
      throw new ConflictError(`Email ${email} already exists`);
    }
  }

  protected async applyFilter(
    data: UserEntity[],
    filter: string | null,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return data;
    }

    return data.filter(item => {
      return item.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    data: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(data, 'createdAt', 'desc')
      : super.applySort(data, sort, sortDir);
  }
}
