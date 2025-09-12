import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import path from 'path';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/' }) // abre servidor próprio na 7070
@Injectable()
export class Events7070Gateway implements OnModuleInit {
  private readonly logger = new Logger(Events7070Gateway.name);

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: WebSocket) => {
      socket.on('message', (message: string) => {
        this.server.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      });
    });
  }
}
