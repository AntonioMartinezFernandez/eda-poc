import { GatewayWsPublisher } from '../../domain/interfaces/gateway-ws-publisher';

export class FetchGatewayWebsockets implements GatewayWsPublisher {
  private readonly gwWsUrl: string;

  constructor(gwWsUrl: string) {
    this.gwWsUrl = gwWsUrl;
  }

  static create(gwWsUrl: string): FetchGatewayWebsockets {
    return new FetchGatewayWebsockets(gwWsUrl);
  }

  public async publish(
    clientId: string,
    event: Record<string, unknown>,
  ): Promise<void> {
    const body = JSON.stringify({
      connectionId: clientId,
      payload: JSON.stringify(event),
    });
    console.log('body', body);
    const response = await fetch(this.gwWsUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      console.log('Error sending event to gateway websockets');
    }
  }
}
