import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Pet } from '../../../../domain/pet';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { PetTypeEntity } from '../../../../../pet-type/infrastructure/persistence/relational/entities/pet-type.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'pet',
})
export class PetEntity extends EntityRelationalHelper implements Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserEntity, (user) => user.pets)
  owner: UserEntity;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  lastSeenLocation: string;

  @Column()
  lastSeenDate: Date;

  @Column()
  status: string;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => PetTypeEntity, {
    eager: true,
  })
  type: PetTypeEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
