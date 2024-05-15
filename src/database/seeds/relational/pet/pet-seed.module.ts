import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetSeedService } from './pet-seed.service';
import { PetEntity } from '../../../../pet/infrastructure/persistence/relational/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  providers: [PetSeedService],
  exports: [PetSeedService],
})
export class PetSeedModule {}
