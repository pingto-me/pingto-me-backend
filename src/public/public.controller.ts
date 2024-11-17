import { Controller, Get, Query } from '@nestjs/common';
import { ENSService } from 'src/common/services/ens-service.service';

@Controller('public')
export class PublicController {
  constructor(private readonly ensService: ENSService) {}
  @Get('hello-world')
  async helloWorld() {
    return 'Hello World!';
  }

  @Get('resolve-name')
  async resolveName(@Query('name') name: string) {
    return await this.ensService.resolveName(name);
  }

  @Get('lookup-address')
  async lookupAddress(@Query('address') address: string) {
    return await this.ensService.lookupAddress(address);
  }
}
