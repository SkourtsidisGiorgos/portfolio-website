/**
 * Base repository interface for entities with string ID.
 *
 * Provides common CRUD operations that all domain repositories share.
 * Extended by specific repository interfaces (ISP - Interface Segregation).
 */
export interface IBaseRepository<T> {
  /**
   * Find all entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Find an entity by its ID.
   */
  findById(id: string): Promise<T | null>;
}
