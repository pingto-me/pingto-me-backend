import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { User } from 'src/utils/decor/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Auth()
@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  create(@User() user: UserEntity, @Body() createOrderDto: CreateOrderDto) {
    createOrderDto.userId = user.id;
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/success')
  updateStatusWhenSuccess(@Param('id') id: string) {
    return this.orderService.updateStatusWhenSuccess(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    updateOrderDto.userId = user.id;
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.orderService.remove(id, user.id);
  }
}
