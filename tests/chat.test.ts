import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as ioC, Socket } from 'socket.io-client';
import { setupHandlers } from '../socket/server';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

describe('my awesome project', () => {
  let io: any, serverSocket: any, clientSocket: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    serverSocket = setupHandlers(serverSocket);
    httpServer.listen();
    clientSocket = ioC();
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should work', (done) => {
    clientSocket.on('hello', (arg: any) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  test('should work (with ack)', (done) => {
    serverSocket.on('hi', (cb: any) => {
      cb('hola');
    });
    clientSocket.emit('hi', (arg: any) => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
