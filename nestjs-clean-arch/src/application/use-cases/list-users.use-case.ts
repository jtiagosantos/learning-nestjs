import { UserRepository } from '@/domain/repositories/user.repository';
import { UseCase } from '@/@core/base/use-case';
import { SearchInput } from '@/@core/inputs/search.input';
import { ListUsersOutput } from '../outputs/list-users.output';
import { SearchParams } from '@/@core/base/searchable-repository.base';
import { PaginationMapper } from '@/@core/mappers/pagination.mapper';
import { UserMapper } from '../mappers/user.mapper';

export class ListUsersUseCase implements UseCase<SearchInput, ListUsersOutput> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: SearchInput) {
    const searchParams = new SearchParams(input);

    const searchResult = await this.userRepository.search(searchParams);

    const data = searchResult.data.map(entity => UserMapper.toOutput(entity));

    return PaginationMapper.toOutput(data, searchResult);
  }
}
