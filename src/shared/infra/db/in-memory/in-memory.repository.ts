import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.errors";
import { IRepository } from "../../../domain/repository/repository-interface";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.findEntity(entity.entity_id);
    this.items[indexFound] = entity;
  }

  async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this.findEntity(entity_id);
    this.items.splice(indexFound, 1);
  }

  async findById(entity_id: EntityId): Promise<E> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return typeof item === "undefined" ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  private findEntity(entity_id: ValueObject): number {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id)
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }
    return indexFound;
  }

  abstract getEntity(): new (...agrs: any[]) => E;
}
