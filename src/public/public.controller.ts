import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  @Get('hello-world')
  async helloWorld() {
    return 'Hello World!';
  }
}
