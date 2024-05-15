import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetEntity } from '../../../../pet/infrastructure/persistence/relational/entities/pet.entity';

@Injectable()
export class PetSeedService {
  constructor(
    @InjectRepository(PetEntity)
    private repository: Repository<PetEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
