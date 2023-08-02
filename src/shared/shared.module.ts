import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config/config.service';
import { QueryService } from './services/query/query.service';

const providers = [
    ConfigService,
    QueryService,
];
@Global()
@Module({
    providers: [ConfigService,QueryService],
    exports: [...providers],
})
export class SharedModule {}
