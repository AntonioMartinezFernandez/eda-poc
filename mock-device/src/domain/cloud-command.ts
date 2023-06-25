export interface CloudCommand {
  type: CloudCommandType;
  id: string;
  name: CloudCommandName;
  payload: Record<string, unknown>;
}

type CloudCommandType = 'COMMAND';
type CloudCommandName =
  | 'START'
  | 'STOP'
  | 'ENABLE_TELEMETRY'
  | 'DISABLE_TELEMETRY'
  | 'SET_DIMMER';
