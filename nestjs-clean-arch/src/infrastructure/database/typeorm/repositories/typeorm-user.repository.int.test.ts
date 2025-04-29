import { TestingSetup } from '../config/testing.setup';
import { TypeORMUserRepository } from './typeorm-user.repository';
import { User } from '../entities/user.entity';
import { randomUUID } from 'node:crypto';
import { UserEntity, UserProps } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import {
  SearchParams,
  SearchResult,
} from '@/@core/base/searchable-repository.base';

describe('TypeORMUserRepository', () => {
  let sut: TypeORMUserRepository;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    sut = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  describe('findById method', () => {
    it('should be able to find a user by id', async () => {
      const user = new UserEntity(UserPropsMaker.make());

      await TestingSetup.dataSource.getRepository(User).insert(user.toJSON());

      const result = await sut.findById(user.id);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.toJSON()).toStrictEqual(user.toJSON());
    });

    it('should return null if user is not found', async () => {
      const result = await sut.findById(randomUUID());

      expect(result).toBeNull();
    });
  });

  describe('insert method', () => {
    it('should be able to insert a user', async () => {
      const user = new UserEntity(UserPropsMaker.make());

      await sut.insert(user);

      const result = await sut.findById(user.id);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.toJSON()).toStrictEqual(user.toJSON());
    });
  });

  describe('findAll method', () => {
    it('should be able to find all users', async () => {
      const user1 = new UserEntity(UserPropsMaker.make());
      const user2 = new UserEntity(UserPropsMaker.make());
      const user3 = new UserEntity(UserPropsMaker.make());

      await TestingSetup.dataSource
        .getRepository(User)
        .insert([user1.toJSON(), user2.toJSON(), user3.toJSON()]);

      const result = await sut.findAll();

      expect(result).toHaveLength(3);
      expect(result[0].toJSON()).toStrictEqual(user1.toJSON());
      expect(result[1].toJSON()).toStrictEqual(user2.toJSON());
      expect(result[2].toJSON()).toStrictEqual(user3.toJSON());
    });
  });

  describe('search method', () => {
    it('should be able to apply only pagination when the other params are not provided', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserPropsMaker.make());

      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...item,
            email: `test${index}@example.com`,
            createdAt: new Date(createdAt.getTime() + index),
          } as UserProps),
        );
      });

      await TestingSetup.dataSource
        .getRepository(User)
        .insert(entities.map(entity => entity.toJSON()));

      const searchResult = await sut.search(new SearchParams());

      expect(searchResult).toBeInstanceOf(SearchResult);
      expect(searchResult.total).toBe(16);
      expect(searchResult.data).toHaveLength(15);
      searchResult.data.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity);
      });
      searchResult.data.reverse().forEach((item, index) => {
        expect(item.email).toBe(`test${index + 1}@example.com`);
      });
    });

    it('should be able to search using filter, sort and pagination', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];

      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...UserPropsMaker.make({ name: item }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await TestingSetup.dataSource
        .getRepository(User)
        .insert(entities.map(entity => entity.toJSON()));

      const searchOutputPage1 = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.data[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
      expect(searchOutputPage1.data[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.data[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
    });
  });

  describe('update method', () => {
    it('should be able to update a user', async () => {
      const user = new UserEntity(UserPropsMaker.make());

      await TestingSetup.dataSource.getRepository(User).insert(user.toJSON());

      user.updateName('new name');

      await sut.update(user);

      const result = await sut.findById(user.id);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.name).toBe('new name');
    });

    it('should not be able to update a user if user is not found', async () => {
      const saveSpyOn = jest.spyOn(
        TestingSetup.dataSource.getRepository(User),
        'save',
      );

      const user = new UserEntity(UserPropsMaker.make());

      user.updateName('new name');

      await sut.update(user);

      expect(saveSpyOn).not.toHaveBeenCalled();
    });
  });

  describe('delete method', () => {
    it('should be able to delete a user', async () => {
      const user = new UserEntity(UserPropsMaker.make());

      await TestingSetup.dataSource.getRepository(User).insert(user.toJSON());

      let result = await sut.findById(user.id);
      expect(result).not.toBeNull();

      await sut.delete(user.id);

      result = await sut.findById(user.id);
      expect(result).toBeNull();
    });

    it('should not be able to delete a user if user is not found', async () => {
      const removeSpyOn = jest.spyOn(
        TestingSetup.dataSource.getRepository(User),
        'remove',
      );

      await sut.delete(randomUUID());

      expect(removeSpyOn).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail method', () => {
    it('should be able to find a user by email', async () => {
      const user = new UserEntity(UserPropsMaker.make());

      await TestingSetup.dataSource.getRepository(User).insert(user.toJSON());

      const result = await sut.findByEmail(user.email);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.toJSON()).toStrictEqual(user.toJSON());
    });

    it('should not be able to find a user by email if user is not found', async () => {
      const result = await sut.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });
});
