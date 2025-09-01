export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;

  protected constructor(
    public readonly eventName: string,
    public readonly aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    this.eventId = eventId ?? "";
    this.occurredOn = occurredOn ?? new Date();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static fromPrimitives: (
    aggregateId: string,
    eventId: string,
    occurredOn: Date,
    attributes: DomainEventAttributes
    // eslint-disable-next-line no-use-before-define
  ) => DomainEvent;

  abstract toPrimitives(): DomainEventAttributes;
}
