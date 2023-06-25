import Websocket from 'websocket';

export const WsConnection = (
  deviceId: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onMessageCallback: Function,
) => {
  const wsConnection = new Websocket.w3cwebsocket(
    `${import.meta.env.VITE_GW_WS_URL}${deviceId}`,
  );

  wsConnection.onopen = () => {
    console.log('Websocket connection established');
  };

  wsConnection.onmessage = async (message) => {
    const data = await JSON.parse(message.data.toString());
    onMessageCallback(data);
  };

  wsConnection.onerror = (error) => {
    console.log(`Websocket error: ${error}`);
  };

  wsConnection.onclose = () => {
    console.log('Websocket connection closed');
  };

  return wsConnection;
};
