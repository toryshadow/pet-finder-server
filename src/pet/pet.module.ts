import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { RelationalPetPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { PetController } from './pet.controller';
import { UsersModule } from '../users/users.module';

const infrastructurePersistenceModule = RelationalPetPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule, UsersModule],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService, infrastructurePersistenceModule],
})
export class PetModule {}
