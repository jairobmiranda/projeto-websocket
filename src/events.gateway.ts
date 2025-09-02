import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/' }) // usa o path root; o port vem do main (3000)
@Injectable()
export class EventsGateway implements OnModuleInit {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // quando novo cliente conectar
    this.server.on('connection', (socket: WebSocket) => {
      // this.logger.log('cliente conectado');

      socket.on('message', (message: string) => {
        // this.logger.log('mensagem recebida: ' + message);
        this.server.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      });

      socket.on('close', () => {
        // this.logger.log('cliente desconectou');
      });
    });
  }
}
