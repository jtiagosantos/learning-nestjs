import { SortDirection } from '@/@core/base/searchable-repository.base';
import { InMemorySearchableRepository } from '@/@core/repositories/in-memory-searchable.repository';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

export class InMemoryUserRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  sortableFields = ['name', 'createdAt'];

  async findByEmail(email: string) {
    const entity = this.data.find(item => item.email === email);

    return entity ?? null;
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
