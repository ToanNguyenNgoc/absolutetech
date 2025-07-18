import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SpareService } from './spare.service';
import { SpareCreate, SpareQr } from './spare.dto';

@Controller('api/spares')
// @UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class SpareController {
  constructor(private readonly spareService: SpareService) {}
  @Get()
  async get(@Query() qr: SpareQr) {
    return this.spareService.getSpares(qr);
  }

  @Post()
  async post(@Body() body: SpareCreate) {
    return this.spareService.createSpare(body);
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: SpareCreate) {
    return this.spareService.updateSpare(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.spareService.deleteSpare(id);
  }
}
