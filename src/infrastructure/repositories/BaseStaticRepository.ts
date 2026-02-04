/**
 * Abstract base class for static JSON-based repositories.
 *
 * Implements common patterns for loading and querying static data (DRY).
 * Concrete repositories extend this and provide entity-specific mapping.
 *
 * @template TEntity - The domain entity type (must have string id)
 * @template TData - The raw JSON data type
 */
export abstract class BaseStaticRepository<
  TEntity extends { id: string },
  TData,
> {
  protected entities: TEntity[];

  constructor(jsonData: TData[]) {
    this.entities = jsonData.map(data => this.mapToEntity(data));
  }

  /**
   * Map raw JSON data to domain entity.
   * Implemented by concrete repositories.
   */
  protected abstract mapToEntity(data: TData): TEntity;

  /**
   * Find all entities.
   * Returns a shallow copy to prevent external mutation.
   */
  async findAll(): Promise<TEntity[]> {
    return [...this.entities];
  }

  /**
   * Find entity by ID.
   */
  async findById(id: string): Promise<TEntity | null> {
    return this.entities.find(entity => entity.id === id) ?? null;
  }

  /**
   * Filter entities by predicate.
   * Utility method for derived repositories.
   */
  protected async filterBy(
    predicate: (entity: TEntity) => boolean
  ): Promise<TEntity[]> {
    return this.entities.filter(predicate);
  }

  /**
   * Find single entity by predicate.
   * Utility method for derived repositories.
   */
  protected async findBy(
    predicate: (entity: TEntity) => boolean
  ): Promise<TEntity | null> {
    return this.entities.find(predicate) ?? null;
  }
}
