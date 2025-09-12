import { Module } from '@nestjs/common';
import { Events7070Gateway } from './events7070.gateway';

@Module({
  providers: [Events7070Gateway],
})
export class App7070Module {}
