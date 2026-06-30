import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersGatewayService } from './users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersGatewayService) {}

  @Roles(UserRole.ADMIN)
  @Permissions('user:list')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions('user:view')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
