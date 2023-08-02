import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config/config.service';

const providers = [
    ConfigService,
];
@Global()
@Module({
    providers: [ConfigService],
    exports: [...providers],
})
export class SharedModule {}
