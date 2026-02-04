/**
 * Value object representing a collection of technologies.
 */
export class TechStack {
  private constructor(private readonly _items: readonly string[]) {}

  static create(items: string[]): TechStack {
    if (!items || items.length === 0) {
      throw new Error('TechStack must contain at least one technology');
    }

    // Remove duplicates and empty strings
    const uniqueItems = [...new Set(items.filter(item => item.trim() !== ''))];

    if (uniqueItems.length === 0) {
      throw new Error('TechStack must contain at least one valid technology');
    }

    return new TechStack(Object.freeze(uniqueItems));
  }

  static empty(): TechStack {
    return new TechStack(Object.freeze([]));
  }

  get items(): readonly string[] {
    return this._items;
  }

  get count(): number {
    return this._items.length;
  }

  contains(technology: string): boolean {
    return this._items.some(
      item => item.toLowerCase() === technology.toLowerCase()
    );
  }

  hasAny(technologies: string[]): boolean {
    return technologies.some(tech => this.contains(tech));
  }

  hasAll(technologies: string[]): boolean {
    return technologies.every(tech => this.contains(tech));
  }

  merge(other: TechStack): TechStack {
    const combined = [...this._items, ...other._items];
    return TechStack.create(combined);
  }

  toString(): string {
    return this._items.join(', ');
  }

  toArray(): string[] {
    return [...this._items];
  }

  equals(other: TechStack): boolean {
    if (this._items.length !== other._items.length) return false;
    const sortedThis = [...this._items].sort();
    const sortedOther = [...other._items].sort();
    return sortedThis.every((item, index) => item === sortedOther[index]);
  }
}
