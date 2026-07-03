import { CreateInteractionDto } from './interaction.dto';
import { CreateMessageDto } from './message.dto';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { UpdateSubscriptionDto } from './subscription.dto';
import { InteractionType, UserRole } from './enums';

export interface UserIdPayload {
  userId: number;
}

export interface FindOneUserPayload {
  id: number;
}

export interface ProfileByUserIdPayload {
  userId: number;
}

export interface CreateProfilePayload {
  userId: number;
  dto: CreateProfileDto;
}

export interface UpdateProfilePayload {
  userId: number;
  dto: UpdateProfileDto;
}

export interface CreateInteractionPayload {
  fromUserId: number;
  dto: CreateInteractionDto;
}

export interface InteractionBetweenPayload {
  fromUserId: number;
  toUserId: number;
}

export interface TryCreateMatchPayload {
  fromUserId: number;
  toUserId: number;
  type: InteractionType;
}

export interface MatchIdPayload {
  id: number;
}

export interface MatchMessagesPayload {
  matchId: number;
  userId: number;
}

export interface SendMessagePayload extends MatchMessagesPayload {
  dto: CreateMessageDto;
}

export interface UpdateSubscriptionPayload {
  userId: number;
  dto: UpdateSubscriptionDto;
}

export interface CreateDomainUserPayload {
  id: number;
  email: string;
  role: UserRole;
}
