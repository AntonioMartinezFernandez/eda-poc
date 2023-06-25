import { Handler } from 'depot-command-bus';
import { ClientDisconnectedEventCommand } from '../commands/client-disconnected-event-command';
import { ClientRepository } from '../../domain/interfaces/client-repository';

export class ClientDisconnectedEventCommandHandler implements Handler {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async handle(command: ClientDisconnectedEventCommand): Promise<any> {
    if (command.getName() !== 'ClientDisconnectedEvent') {
      console.log(
        'Invalid command received at ClientDisconnectedEventCommandHandler',
      );
      return;
    }

    await this.clientRepository.removeConnection(
      command.connectionId,
      command.deviceId,
    );
    return command.getName();
  }
}
