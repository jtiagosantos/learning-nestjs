import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { InMemoryUserRepository } from './in-memory-user.repository';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { ConflictError } from '@/@core/errors/conflict.error';

describe('InMemoryUserRepository (unit)', () => {
  let sut: InMemoryUserRepository;

  beforeEach(() => {
    sut = new InMemoryUserRepository();
  });

  describe('findByEmail method', () => {
    it('should not be able to find an entity by an inexistent email', async () => {
      const email = 'test@test.com';
      await expect(() => sut.findByEmail(email)).rejects.toThrow(
        new EntityNotFoundError(`Entity with email ${email} not found`),
      );
    });

    it('should be able to find an entity by an existent email', async () => {
      const entity = new UserEntity(UserPropsMaker.make());
      await sut.insert(entity);
      const result = await sut.findByEmail(entity.email);

      expect(result.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe('emailExists method', () => {
    it('should be able to throw a conflict error when email already exists', async () => {
      const entity = new UserEntity(UserPropsMaker.make());
      await sut.insert(entity);
      await expect(() => sut.emailExists(entity.email)).rejects.toThrow(
        new ConflictError(`Email ${entity.email} already exists`),
      );
    });

    it('should not be able to throw a conflict error when email already exists', async () => {
      expect.assertions(0);
      await sut.emailExists('test@test.com');
    });
  });

  describe('applyFilter method', () => {
    it('should not be able to filter data when no filter is provided', async () => {
      const entity = new UserEntity(UserPropsMaker.make());
      await sut.insert(entity);
      const result = await sut.findAll();
      const spyFilter = jest.spyOn(result, 'filter');
      const filteredData = await sut['applyFilter'](result, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(filteredData).toStrictEqual(result);
    });

    it('should be able to filter data when a filter is provided', async () => {
      const data = [
        new UserEntity(UserPropsMaker.make({ name: 'Test' })),
        new UserEntity(UserPropsMaker.make({ name: 'fake' })),
        new UserEntity(UserPropsMaker.make({ name: 'TEST' })),
      ];
      const spyFilter = jest.spyOn(data, 'filter');
      const filteredData = await sut['applyFilter'](data, 'TEST');

      expect(spyFilter).toHaveBeenCalled();
      expect(filteredData).toStrictEqual([data[0], data[2]]);
    });
  });

  describe('applySort method', () => {
    it('should be able to sort by createdAt when sort param is not provided', async () => {
      const createdAt = new Date();
      const data = [
        new UserEntity(UserPropsMaker.make({ name: 'Test', createdAt })),
        new UserEntity(
          UserPropsMaker.make({
            name: 'TEST',
            createdAt: new Date(createdAt.getTime() + 1),
          }),
        ),
        new UserEntity(
          UserPropsMaker.make({
            name: 'fake',
            createdAt: new Date(createdAt.getTime() + 2),
          }),
        ),
      ];
      const sortedData = await sut['applySort'](data, null, null);
      expect(sortedData).toStrictEqual([data[2], data[1], data[0]]);
    });

    it('should be able to sort by sort param when it is provided', async () => {
      const data = [
        new UserEntity(UserPropsMaker.make({ name: 'c' })),
        new UserEntity(
          UserPropsMaker.make({
            name: 'd',
          }),
        ),
        new UserEntity(
          UserPropsMaker.make({
            name: 'a',
          }),
        ),
      ];
      let sortedData = await sut['applySort'](data, 'name', 'asc');
      expect(sortedData).toStrictEqual([data[2], data[0], data[1]]);

      sortedData = await sut['applySort'](data, 'name', null);
      expect(sortedData).toStrictEqual([data[1], data[0], data[2]]);
    });
  });
});
