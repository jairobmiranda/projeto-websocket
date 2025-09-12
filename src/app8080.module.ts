import { Module } from '@nestjs/common';
import { Events8080Gateway } from './events8080.gateway';

@Module({
  providers: [Events8080Gateway],
})
export class App8080Module {}
