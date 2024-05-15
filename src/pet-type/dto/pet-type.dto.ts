import { ApiProperty } from '@nestjs/swagger';
import { PetType } from '../domain/pet-type';
import { IsNumber } from 'class-validator';

export class PetTypeDto implements PetType {
  @ApiProperty()
  @IsNumber()
  id: number;
}
