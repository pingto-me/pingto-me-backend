import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { RandomService } from 'src/common/services/random.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { UserService } from 'src/user/user.service';
import { DataService } from 'src/utils/typesaurus/data.service';
import { BlockscoutService } from 'src/common/services/blockscout.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { EventService } from 'src/event/event.service';

@Module({
  controllers: [CardController],
  providers: [
    CardService,
    FirebaseService,
    RandomService,
    UuidService,
    UserService,
    DataService,
    BlockscoutService,
    PaginationService,
    EventService,
  ],
})
export class CardModule {}
