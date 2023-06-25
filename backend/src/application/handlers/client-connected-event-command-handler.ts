import { Handler } from 'depot-command-bus';
import { ClientConnectedEventCommand } from '../commands/client-connected-event-command';
import { ClientRepository } from '../../domain/interfaces/client-repository';

export class ClientConnectedEventCommandHandler implements Handler {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async handle(command: ClientConnectedEventCommand): Promise<any> {
    if (command.getName() !== 'ClientConnectedEvent') {
      console.log(
        'Invalid command received at ClientConnectedEventCommandHandler',
      );
      return;
    }

    await this.clientRepository.saveConnection(
      command.connectionId,
      command.deviceId,
    );
    return command.getName();
  }
}
