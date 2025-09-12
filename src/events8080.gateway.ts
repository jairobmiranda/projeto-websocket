import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/' }) // abre servidor próprio na 8080
@Injectable()
export class Events8080Gateway implements OnModuleInit {
  private readonly logger = new Logger(Events8080Gateway.name);

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: WebSocket) => {
      (socket as any).isAlive = true;

      socket.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          if (data?.cmd === 'pong') {
            (socket as any).isAlive = true;
            return;
          }
        } catch {
          // mensagem normal -> broadcast
        }

        this.server.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      });
    });

    // heartbeat a cada 30s
    setInterval(() => {
      this.server.clients.forEach((socket: any) => {
        if (!socket.isAlive) {
          // this.logger.warn('Cliente inativo no 8080, desconectando...');
          // divulga quem foi desconectado
          this.server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ cmd: 'disconnected', client: socket._socket.remoteAddress }) );
            }
          });
          return socket.terminate();
        }
        socket.isAlive = false;
        socket.send(JSON.stringify({ cmd: 'ping' }));
      });
    }, 30000);
  }
}
