import { Entity } from '../base/entity.base';
import { Repository } from '../base/repository.base';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

export abstract class InMemoryRepository<E extends Entity>
  implements Repository<E>
{
  public readonly data: E[] = [];

  async insert(entity: E): Promise<void> {
    this.data.push(entity);
  }

  async findById(id: string): Promise<E | null> {
    const entity = this.data.find(item => item.id === id);

    return entity ?? null;
  }

  async findAll(): Promise<E[]> {
    return this.data;
  }

  async update(entity: E): Promise<void> {
    const index = this.data.findIndex(item => item.id === entity.id);

    if (index === -1) {
      throw new EntityNotFoundError(`entity with id ${entity.id} not found`);
    }

    this.data[index] = entity;
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex(item => item.id === id);

    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }
}
