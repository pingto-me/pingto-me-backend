import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UuidService } from 'src/utils/uuid/uuid.service';

import { DataService } from 'src/utils/typesaurus/data.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UuidService, DataService, PaginationService],
})
export class UserModule {}
