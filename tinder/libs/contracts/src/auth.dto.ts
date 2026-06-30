import { IsEmail, IsInt, IsString, MinLength } from 'class-validator';
import { UserRole } from './enums';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(20)
  refreshToken!: string;
}

export class CreateDomainUserDto {
  @IsInt()
  id!: number;

  @IsEmail()
  email!: string;

  @IsString()
  role!: UserRole;
}
