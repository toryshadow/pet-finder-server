import { Allow } from 'class-validator';

export class PetType {
  @Allow()
  id: number;

  @Allow()
  name?: string;
}
