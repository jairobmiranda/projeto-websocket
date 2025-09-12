import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs';
import { App8080Module } from './app8080.module';
import { App7070Module } from './app7070.module';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined;

  try {
    httpsOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/tds.sisnet.app/privkey.pem'),
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/tds.sisnet.app/fullchain.pem',
      ),
    };
    console.log('Certificados HTTPS carregados com sucesso.');
  } catch (err) {
    console.warn('Certificados HTTPS não encontrados. Iniciando sem HTTPS.');
  }

  // Servidor 7070 com Events7070Gateway
  const ws7070 = await NestFactory.create(
    App7070Module,
    httpsOptions ? { httpsOptions } : {},
  );
  ws7070.useWebSocketAdapter(new WsAdapter(ws7070));
  await ws7070.listen(8080);

  const protocol7070 = httpsOptions ? 'wss' : 'ws';
  console.log(`App rodando na porta 7070 (${protocol7070}://localhost:7070)`);

  // Servidor 8080 com Events8080Gateway
  const ws8080 = await NestFactory.create(
    App8080Module,
    httpsOptions ? { httpsOptions } : {},
  );
  ws8080.useWebSocketAdapter(new WsAdapter(ws8080));
  await ws8080.listen(7070);

  const protocol8080 = httpsOptions ? 'wss' : 'ws';
  console.log(`App rodando na porta 8080 (${protocol8080}://localhost:8080)`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});