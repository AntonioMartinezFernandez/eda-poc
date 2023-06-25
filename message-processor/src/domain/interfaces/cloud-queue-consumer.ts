export interface CloudQueueConsumer {
  consume(callback: (msg: string) => void): Promise<void>;
  start(): Promise<void>;
  stop(): void;
}
