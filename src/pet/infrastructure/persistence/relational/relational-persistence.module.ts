import { Module } from '@nestjs/common';
import { PetRelationalRepository } from './repositories/pet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from './entities/pet.entity';
import { PetRepository } from '../pet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  providers: [
    {
      provide: PetRepository,
      useClass: PetRelationalRepository,
    },
  ],
  exports: [PetRepository],
})
export class RelationalPetPersistenceModule {}
