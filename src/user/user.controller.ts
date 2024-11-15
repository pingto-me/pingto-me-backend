/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserListDto } from './dto/user-list.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/models/role.enum';
import { SaveAccountRawDataDto } from './dto/save-account-raw-data.dto';
import { UpdateUserProfile } from './dto/update-profile.dto';

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
  async updateProfile(@Req() req: any, @Body() body: UpdateUserProfile) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Auth()
  @Get('me')
  async me(@Req() req: any) {
    return this.userService.getUserById(req.user.id);
  }

  @Auth()
  @Post('me/account-raw-data')
  async saveAccountRawData(
    @Req() req: any,
    @Body() body: SaveAccountRawDataDto,
  ) {
    return this.userService.saveAccountRawDataByUserId(req.user.id, body);
  }
}
