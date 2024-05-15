import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { FilterPetDto, SortPetDto } from '../../dto/query-pet.dto';
import { PetEntity } from './relational/entities/pet.entity';
import { Pet } from '../../domain/pet';
import { DeepPartial } from 'typeorm';

export abstract class PetRepository {
  abstract findOne(options: EntityCondition<Pet>): Promise<NullableType<Pet>>;

  abstract create(
    data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'>,
  ): Promise<Pet>;

  abstract update(
    id: PetEntity['id'],
    payload: DeepPartial<Omit<Pet, 'id'>>,
  ): Promise<Pet | null>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPetDto | null;
    sortOptions?: SortPetDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Pet[]>;

  abstract softDelete(id: PetEntity['id']): Promise<void>;
}
