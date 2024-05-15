import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { PetEntity } from '../entities/pet.entity';
import { Pet } from '../../../../domain/pet';
import { PetTypeEntity } from '../../../../../pet-type/infrastructure/persistence/relational/entities/pet-type.entity';

export class PetMapper {
  static toDomain(raw: PetEntity): Pet {
    const pet = new Pet();
    pet.id = raw.id;
    pet.name = raw.name;
    pet.description = raw.description;

    if (raw.photo) {
      pet.photo = FileMapper.toDomain(raw.photo);
    }
    pet.type = raw.type;
    pet.status = raw.status;
    pet.lastSeenLocation = raw.lastSeenLocation;
    pet.lastSeenDate = raw.lastSeenDate;
    pet.createdAt = raw.createdAt;
    pet.updatedAt = raw.updatedAt;
    pet.deletedAt = raw.deletedAt;
    return pet;
  }

  static toPersistence(pet: Pet): PetEntity {
    let photo: FileEntity | undefined | null = undefined;

    if (pet.photo) {
      photo = new FileEntity();
      photo.id = pet.photo.id;
      photo.path = pet.photo.path;
    } else if (pet.photo === null) {
      photo = null;
    }

    const petEntity = new PetEntity();
    if (pet.id && typeof pet.id === 'number') {
      petEntity.id = pet.id;
    }
    petEntity.name = pet.name;
    petEntity.description = pet.description;

    if (pet.type?.name) {
      petEntity.type = new PetTypeEntity();
      petEntity.type.name = pet.type?.name;
    }

    petEntity.photo = photo;
    petEntity.lastSeenDate = pet.lastSeenDate;
    petEntity.lastSeenLocation = pet.lastSeenLocation;
    petEntity.createdAt = pet.createdAt;
    petEntity.updatedAt = pet.updatedAt;
    petEntity.deletedAt = pet.deletedAt;
    return petEntity;
  }
}
