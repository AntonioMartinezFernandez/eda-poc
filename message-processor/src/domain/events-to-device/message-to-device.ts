import { DeviceCommandFromCloud } from '../events-from-cloud/command-from-cloud';
import { DeviceCommand } from './device-command';

export interface MessageToDevice {
  deviceId: string;
  command: DeviceCommand;
}

export class NewMessageToDevice {
  public static async parse(
    commandFromCloud: string,
  ): Promise<MessageToDevice | Error> {
    try {
      // Parse command from cloud
      const parsedCommandFromCloud: DeviceCommandFromCloud = await JSON.parse(
        commandFromCloud,
      );

      // Validate command from cloud
      if (
        parsedCommandFromCloud.parameters.id === undefined ||
        parsedCommandFromCloud.command_id === undefined
      ) {
        return new Error('Received invalid command from cloud');
      }

      // Device command
      const deviceCommand: DeviceCommand = {
        type: 'COMMAND',
        id: parsedCommandFromCloud.command_id,
        name: parsedCommandFromCloud.command,
        payload: parsedCommandFromCloud.parameters.payload,
      };

      const commandToDevice: MessageToDevice = {
        deviceId: parsedCommandFromCloud.parameters.id,
        command: deviceCommand,
      };

      return commandToDevice;
    } catch (error) {
      return new Error('Received invalid command from cloud');
    }
  }
}
