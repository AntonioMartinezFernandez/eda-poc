CREATE TABLE IF NOT EXISTS devices (
  deviceId VARCHAR(50) NOT NULL,
  connected BOOL DEFAULT FALSE,
  dimmer INT DEFAULT 0,
  created_at BIGINT,
  updated_at BIGINT,
  PRIMARY KEY (deviceId)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;