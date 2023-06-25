export interface EventConsumer {
  start(): Promise<void | Error>;
  stop(): Promise<void | Error>;
}
