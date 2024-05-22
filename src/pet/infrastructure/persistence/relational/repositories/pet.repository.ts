import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PetEntity } from '../entities/pet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';

import { PetRepository } from '../../pet.repository';
import { Pet } from '../../../../domain/pet';

import { PetMapper } from '../mappers/pet.mapper';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { FilterPetDto, SortPetDto } from '../../../../dto/query-pet.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class PetRelationalRepository implements PetRepository {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petEntityRepository: Repository<PetEntity>,
  ) {}

  async findOne(options: EntityCondition<Pet>): Promise<NullableType<Pet>> {
    const entity = await this.petEntityRepository.findOne({
      where: options as FindOptionsWhere<PetEntity>,
    });

    return entity ? PetMapper.toDomain(entity) : null;
  }

  async create(data: PetEntity): Promise<PetEntity> {
    return this.petEntityRepository.save(this.petEntityRepository.create(data));
  }
  async update(
    id: Pet['id'],
    payload: Partial<Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
  ): Promise<Pet | null> {
    const entity = await this.petEntityRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Pet not found');
    }

    const updatedEntity = await this.petEntityRepository.save(
      this.petEntityRepository.create(
        PetMapper.toPersistence({
          ...PetMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PetMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Pet['id']): Promise<void> {
    await this.petEntityRepository.softDelete({
      id: +id,
    });
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    owner,
  }: {
    filterOptions?: FilterPetDto | null;
    sortOptions?: SortPetDto[] | null;
    paginationOptions: IPaginationOptions;
    owner?: UserEntity;
  }): Promise<Pet[]> {
    let where: FindOptionsWhere<PetEntity> = {};
    if (owner) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      where = { ...where, owner: owner.id };
    }
    console.log(filterOptions);
    const entities = await this.petEntityRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((pet) => PetMapper.toDomain(pet));
  }
}
