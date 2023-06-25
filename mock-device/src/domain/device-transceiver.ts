import { Observable } from 'rxjs';
import { DeviceMessage } from './device-message';

export interface DeviceTransceiver {
  receivedCommandObservable(): Observable<string>;
  sendTelemetryEvent(message: DeviceMessage): void;
  sendCommonEvent(message: DeviceMessage): void;
}
