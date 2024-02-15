import { Entity } from '../../../../domain/entity';
import { NotFoundError } from '../../../../domain/errors/not-found.error';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../in-memory.repository';

type TStubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: TStubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...agrs: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
  });

  it('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  it('should return all entities', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    const entities = await repo.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  it('should throws errors on update when entity not found', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    );
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });
    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'updated',
      price: 1,
    });

    await repo.update(entityUpdated);

    expect(entityUpdated.toJSON()).toStrictEqual(repo.items[0].toJSON());
  });

  it('should throws errors on delete when entity not found', async () => {
    const uuid = new Uuid();

    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity),
    );

    await expect(
      repo.delete(new Uuid('54c5b8da-f85b-4101-825d-593c93809c60')),
    ).rejects.toThrow(
      new NotFoundError('54c5b8da-f85b-4101-825d-593c93809c60', StubEntity),
    );
  });

  it('should deletes an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });
    await repo.insert(entity);

    await repo.delete(entity.entity_id);
    expect(repo.items).toHaveLength(0);
  });
});
