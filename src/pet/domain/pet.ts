import { User } from '../../users/domain/user';
import { PetType } from '../../pet-type/domain/pet-type';
import { FileDto } from '../../files/dto/file.dto';

export class Pet {
  id: number;

  name: string;

  description: string;

  lastSeenLocation: string;

  lastSeenDate: Date;

  status: string;

  photo?: FileDto | null;

  owner: User;

  type: PetType;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
