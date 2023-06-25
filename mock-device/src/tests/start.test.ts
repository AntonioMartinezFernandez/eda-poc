import * as dotenv from 'dotenv';
dotenv.config();

describe('Config', () => {
  it('mqtt broker', () => {
    const mqtt_broker = process.env.MQTT_BROKER_URL;
    expect(mqtt_broker).toBe('mqtt://localhost');
  });
  it('mqtt user', () => {
    const mqtt_user = process.env.MQTT_USER;
    expect(mqtt_user).toBe('admin');
  });
  it('mqtt password', () => {
    const mqtt_password = process.env.MQTT_PASSWORD;
    expect(mqtt_password).toBe('password');
  });
});
