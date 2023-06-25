export type DomainEvent = {
  data: DomainEventData;
  meta: DomainEventMeta;
};

export type DomainEventData = {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
};

export type DomainEventMeta = {
  service: string;
  version: string;
  created_at: number;
};
