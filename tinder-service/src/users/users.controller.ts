import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDomainUserDto, USERS_PATTERNS } from '@app/contracts';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.CREATE_FROM_AUTH)
  createFromAuth(@Payload() dto: CreateDomainUserDto) {
    return this.usersService.createFromAuth(dto);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE)
  findOne(@Payload() payload: { id: number }) {
    return this.usersService.findOne(payload.id);
  }
}
