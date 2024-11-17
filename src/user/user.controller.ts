/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserListDto } from './dto/user-list.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/models/role.enum';
import { SaveAccountRawDataDto } from './dto/save-account-raw-data.dto';
import { UpdateUserProfile } from './dto/update-profile.dto';
import { User } from 'src/utils/decor/user.decorator';
import { UserEntity } from './entities/user.entity';
const logger = new Logger('UserController');
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(Role.ADMIN)
  @Get()
  async list(@Req() req: any, @Query() query: UserListDto) {
    query.authByUserId = req.user.id;
    return this.userService.list(query);
  }

  @Auth()
  @Post('update-profile')
  async updateProfile(@Body() body: UpdateUserProfile, @Req() req: any) {
    logger.log('updateProfile body', body);
    return this.userService.updateProfile(req.user.id, body);
  }

  @Auth()
  @Get('profile-card')
  async profileCard(@User() user: UserEntity) {
    return this.userService.getUserProfileCard(user.id);
  }

  @Auth()
  @Get('me')
  async me(@Req() req: any) {
    return this.userService.getUserById(req.user.id);
  }

  @Auth()
  @Get('referral/:refCode')
  async getUserProfileByRefCode(@Param('refCode') refCode: string) {
    return this.userService.getUserProfileByRefCode(refCode);
  }
}
