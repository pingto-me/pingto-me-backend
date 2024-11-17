import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserLinkService } from './user-link.service';
import { CreateUserLinkDto } from './dto/create-user-link.dto';
import { UpdateUserLinkDto } from './dto/update-user-link.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { SocialPlatformProvider } from 'src/common/provider/social-platform-provider';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/utils/decor/user.decorator';

@Controller('user-links')
export class UserLinkController {
  constructor(
    private readonly userLinkService: UserLinkService,
    private readonly socialPlatformProvider: SocialPlatformProvider,
  ) {}

  @Get('platforms')
  async getSocialPlatform() {
    return this.socialPlatformProvider.getSocialPlatforms();
  }

  @Auth()
  @Post()
  create(
    @Body() createUserLinkDto: CreateUserLinkDto,
    @User() user: UserEntity,
  ) {
    createUserLinkDto.userId = user.id;
    return this.userLinkService.create(createUserLinkDto);
  }

  @Auth()
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.userLinkService.findAllByUserId(userId);
  }

  @Auth()
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.userLinkService.findOne(id, userId);
  }

  @Auth()
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateUserLinkDto: UpdateUserLinkDto,
  ) {
    const userId = req.user.id;
    updateUserLinkDto.userId = userId;
    return this.userLinkService.update(id, updateUserLinkDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.userLinkService.remove(id, userId);
  }
}
