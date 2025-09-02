import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
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
      this.logger.log('cliente conectado');

      socket.on('message', (message: string) => {
        this.logger.log('mensagem recebida: ' + message);
        let data: any;
        try {
          data = JSON.parse(message);
        } catch (e) {
          data = { type: 'raw', raw: message };
        }

        // Se receber ping, responde pong
        if (data && data.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong', ts: new Date().toISOString() }));
          return;
        }

        // Broadcast: envia para todos os clientes abertos
        const payload = {
          type: 'message',
          user: data.user ?? 'anon',
          text: data.text ?? data.raw ?? '',
          ts: data.ts ?? new Date().toISOString(),
          serverTs: new Date().toISOString()
        };

        const rawOut = JSON.stringify(payload);
        this.server.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(rawOut);
          }
        });
      });

      socket.on('close', () => {
        this.logger.log('cliente desconectou');
      });
    });
  }
}
