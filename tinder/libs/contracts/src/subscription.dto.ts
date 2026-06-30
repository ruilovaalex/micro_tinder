import { IsEnum, IsInt } from 'class-validator';
import { SubscriptionPlan } from './enums';

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;
}

export class EnsureSubscriptionDto {
  @IsInt()
  userId!: number;
}
