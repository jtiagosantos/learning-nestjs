import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { Entity } from './entity.base';
import { faker } from '@faker-js/faker/.';

interface StubProps {
  prop1: string;
  prop2: number;
}

class StubEntity extends Entity<StubProps> {
  getProps() {
    return this.props;
  }
}

describe('Entity (unit)', () => {
  it('should be able to set props', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };

    const entity = new StubEntity(props);

    expect(entity.getProps()).toStrictEqual(props);
  });

  it('should be able to generate a new id if none is provided', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };

    const entity = new StubEntity(props);

    expect(entity.id).not.toBeNull();
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it('should be able to set a custom id', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };
    const id = uuidv4();

    const entity = new StubEntity(props, id);

    expect(entity.id).toBe(id);
  });

  it('should be able to convert to a JSON', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };
    const id = uuidv4();

    const entity = new StubEntity(props, id);

    const JSON = entity.toJSON();

    expect(JSON).toStrictEqual({
      id,
      createdAt: entity.createdAt,
      ...props,
    });
  });

  it('should be able to get the id value by the getter of id', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };

    const entity = new StubEntity(props);

    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe('string');
  });

  it('should be able to get the createdAt value by the getter of createdAt', () => {
    const props: StubProps = {
      prop1: faker.string.alpha(10),
      prop2: faker.number.int(),
    };

    const entity = new StubEntity(props);

    expect(entity.createdAt).toBeDefined();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });
});
