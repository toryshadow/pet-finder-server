import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Pet } from '../domain/pet';
import { PetTypeDto } from '../../pet-type/dto/pet-type.dto';

export class FilterPetDto {
  @ApiPropertyOptional({ type: PetTypeDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PetTypeDto)
  type?: PetTypeDto[] | null;
}

export class SortPetDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Pet;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryPetrDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterPetDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPetDto)
  filters?: FilterPetDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortPetDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPetDto)
  sort?: SortPetDto[] | null;
}
