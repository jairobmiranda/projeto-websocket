import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs';

async function bootstrap() {
  // Carrega os certificados Let's Encrypt
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/tds.sisnet.app/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/tds.sisnet.app/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  // registra adapter ws
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(7070); // servidor HTTP + WS no mesmo processo
  console.log('App rodando na porta 7070 (ws://localhost:7070)');
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});
