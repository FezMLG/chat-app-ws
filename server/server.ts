import { createServer } from 'http';
import {
  createClient,
  RedisClientType,
  RedisModules,
  RedisScripts,
} from 'redis';
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { setupHandlers } = require('../socket/server');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });
  const io = new Server(server);
  const client = createClient();
  await client.connect();

  setupHandlers(io, client);
  server.listen(port);
  // await client.quit();
});
