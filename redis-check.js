const { createClient } = require('redis');
const dotenv = require('dotenv');
const process = require('process');

dotenv.config();

async function testRedisConnection() {
  const connectionString = process.env.REDIS_CONNECTION_STRING;

  if (!connectionString) {
    console.error("REDIS_CONNECTION_STRING not found in .env file. Did you read the README? 😉");
    return;
  }

  const host = connectionString.split(',')[0].split(':')[0];
  const passwordMatch = connectionString.match(/password=([^,]*)/);
  const password = passwordMatch ? passwordMatch[1] : null;

  console.log(`Connecting to Redis host: ${host}`);

  const client = createClient({
    socket: {
      host: host + 'x',
      port: 6380,
      tls: true,
    },
    password: password,
  });

  client.on('error', async (err) => {
    console.error('Instantiating the Redis client failed, with this errror:', err);
    client.destroy();
    process.exit(1);
  });

  try {
    await client.connect();
    const response = await client.ping();
    console.log(`Successfully connected to Redis and received this very nifty response: ${response}!`);
  } catch (err) {
    console.error(`Failed to connect to Redis and received this very sad error: ${err.message}`);
  } finally {
    await client.disconnect();
  }
}

testRedisConnection();
