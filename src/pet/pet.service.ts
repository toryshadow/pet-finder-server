import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { User } from '../users/domain/user';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { CreatePetDto } from './dto/create-pet.dto';
import { FilterPetDto, SortPetDto } from './dto/query-pet.dto';
import { PetRepository } from './infrastructure/persistence/pet.repository';
import { Pet } from './domain/pet';

@Injectable()
export class PetService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createPetDto: CreatePetDto, user: User): Promise<Pet> {
    const clonedPayload = {
      ...createPetDto,
      status: 'created',
      owner: user,
    };
    //
    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      clonedPayload.photo = fileObject;
    }

    return this.petRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPetDto | null;
    sortOptions?: SortPetDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Pet[]> {
    return this.petRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Pet>): Promise<NullableType<Pet>> {
    return this.petRepository.findOne(fields);
  }

  async update(id: Pet['id'], payload: DeepPartial<Pet>): Promise<Pet | null> {
    const clonedPayload = { ...payload };

    return this.petRepository.update(id, clonedPayload);
  }

  async softDelete(id: Pet['id']): Promise<void> {
    await this.petRepository.softDelete(+id);
  }
}
