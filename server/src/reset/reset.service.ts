import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reset } from './reset.entity';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(Reset)
    private readonly resetService: Repository<Reset>,
  ) {}

  async save(body) {
    return this.resetService.save(body);
  }

  async findOne(options) {
    return this.resetService.findOne({
      where: options,
    });
  }
}
