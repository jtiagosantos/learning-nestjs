import {
  SearchParams,
  SearchResult,
} from '@/@core/base/searchable-repository.base';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserModelMapper } from '../mappers/user-model.mapper';

@Injectable()
export class TypeORMUserRepository implements UserRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async insert(entity: UserEntity): Promise<void> {
    await this.userRepository.insert(entity.toJSON());
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) return null;

    return UserModelMapper.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();

    return users.map(user => UserModelMapper.toEntity(user));
  }

  async update(entity: UserEntity): Promise<void> {
    const user = await this.userRepository.preload({
      ...entity.toJSON(),
      id: entity.id,
    });

    if (!user) return;

    await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) return;

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    return UserModelMapper.toEntity(user);
  }

  async search(
    input: SearchParams<string>,
  ): Promise<SearchResult<UserEntity, string>> {
    const sortable = this.sortableFields.includes(input.sort ?? '') || false;
    const orderByField = sortable ? input.sort! : 'createdAt';
    const orderByDirection = sortable ? input.sortDir : 'desc';

    const count = await this.userRepository.count({
      ...(input.filter && {
        where: {
          name: ILike(`%${input.filter}%`),
        },
      }),
    });

    const users = await this.userRepository.find({
      ...(input.filter && {
        where: {
          name: ILike(`%${input.filter}%`),
        },
      }),
      order: {
        [orderByField]: orderByDirection,
      },
      skip: input.page && input.page > 0 ? (input.page - 1) * input.perPage : 0,
      take: input.perPage && input.perPage > 0 ? input.perPage : 15,
    });

    return new SearchResult({
      data: users.map(user => UserModelMapper.toEntity(user)),
      total: count,
      currentPage: input.page,
      perPage: input.perPage,
      sort: orderByField,
      sortDir: orderByDirection,
      filter: input.filter,
    });
  }
}
