export interface GatewayWsPublisher {
  publish(clientId: string, event: Record<string, unknown>): Promise<void>;
}
