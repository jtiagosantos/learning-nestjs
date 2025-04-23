import { randomUUID } from 'node:crypto';

export abstract class Entity<Props = any> {
  private readonly _id: string;
  private readonly _createdAt: Date;
  protected readonly props: Props;

  constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID();
    this._createdAt = new Date();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      createdAt: this._createdAt,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
