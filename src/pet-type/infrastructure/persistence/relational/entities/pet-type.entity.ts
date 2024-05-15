import { Column, Entity, PrimaryColumn } from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { PetType } from '../../../../domain/pet-type';

@Entity({
  name: 'pet-type',
})
export class PetTypeEntity extends EntityRelationalHelper implements PetType {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
