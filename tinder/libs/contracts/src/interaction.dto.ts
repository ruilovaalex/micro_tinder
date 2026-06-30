import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { InteractionType } from './enums';

export class CreateInteractionDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toUserId!: number;

  @IsEnum(InteractionType)
  type!: InteractionType;
}
