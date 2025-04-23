import { faker } from '@faker-js/faker/.';
import { Entity } from '../base/entity.base';
import { InMemoryRepository } from './in-memory.repository';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

interface StubProps {
  prop1: string;
  prop2: number;
  prop3: boolean;
}

class StubEntity extends Entity<StubProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository (unit)', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('should be able to insert an item', async () => {
    const entity = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });

    await sut.insert(entity);

    expect(sut.data).toHaveLength(1);
    expect(sut.data[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should be able to find an item by id', async () => {
    const entity = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });

    await sut.insert(entity);

    const item = (await sut.findById(entity.id))!;

    expect(item.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should not be able to find an inexistent item by id', async () => {
    const item = await sut.findById('inexistent-id');

    expect(item).toBeNull();
  });

  it('should be able to find all items', async () => {
    const entity1 = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });
    await sut.insert(entity1);

    const entity2 = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });
    await sut.insert(entity2);

    const items = await sut.findAll();

    expect(items).toHaveLength(2);
  });

  it('should be able to update an item', async () => {
    const entity = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });

    await sut.insert(entity);

    const updatedEntity = new StubEntity(
      {
        prop1: 'updated-value',
        prop2: 9999,
        prop3: false,
      },
      entity.id,
    );

    await sut.update(updatedEntity);

    const item = (await sut.findById(entity.id))!;

    expect(item.toJSON()).toStrictEqual(updatedEntity.toJSON());
  });

  it('should not be able to update an inexistent item', async () => {
    const updatedEntity = new StubEntity(
      {
        prop1: 'updated-value',
        prop2: 9999,
        prop3: false,
      },
      'inexistent-id',
    );

    await expect(() => sut.update(updatedEntity)).rejects.toThrow(
      new EntityNotFoundError('entity with id inexistent-id not found'),
    );
  });

  it('should be able to delete an item', async () => {
    const entity = new StubEntity({
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
      prop3: true,
    });

    await sut.insert(entity);

    await sut.delete(entity.id);

    expect(sut.data).toHaveLength(0);
  });
});
