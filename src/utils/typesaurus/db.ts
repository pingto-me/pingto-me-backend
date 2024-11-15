import { ProviderDataEntity } from 'src/user/entities/provider-data.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { schema } from 'typesaurus';

export const db = schema(($) => ({
  users: $.collection<UserEntity>(),
  providerDatas: $.collection<ProviderDataEntity>(),
}));
