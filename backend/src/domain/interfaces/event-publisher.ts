export interface EventPublisher {
  publish(event: string): Promise<void | Error>;
}
