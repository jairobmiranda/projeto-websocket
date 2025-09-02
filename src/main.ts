import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // registra adapter ws
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000); // servidor HTTP + WS no mesmo processo
  console.log('App rodando na porta 3000 (ws://localhost:3000)');
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});
