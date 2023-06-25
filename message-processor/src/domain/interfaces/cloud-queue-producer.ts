export interface CloudQueueProducer {
  send(message: string): Promise<void | Error>;
  start(): Promise<void>;
  stop(): void;
}
