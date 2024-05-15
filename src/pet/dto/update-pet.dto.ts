import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { PetTypeEntity } from '../../pet-type/infrastructure/persistence/relational/entities/pet-type.entity';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @ApiProperty({ example: 'Cat' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  lastSeenLocation: string;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsDate()
  lastSeenDate: Date;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: PetTypeEntity })
  @IsOptional()
  @Type(() => PetTypeEntity)
  type: PetTypeEntity;
}
