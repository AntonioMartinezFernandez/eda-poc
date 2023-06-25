import { Command } from 'depot-command-bus';

export class RequestedDevicesEventCommand implements Command {
  public getName(): string {
    return 'RequestedDevicesEvent';
  }
}
