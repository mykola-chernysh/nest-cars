import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../repository/services/user.repository';
import { BaseUserRequestDto } from '../models/dto/request/base-user.request.dto';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(createUserDto: BaseUserRequestDto): Promise<string> {
    return 'This action adds a new user';
  }

  public async findAll(): Promise<string> {
    return `This action returns all user`;
  }

  public async findOne(id: number): Promise<string> {
    return `This action returns a #${id} user`;
  }

  public async update(id: number, updateUserDto: UpdateUserRequestDto): Promise<string> {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number): Promise<string> {
    return `This action removes a #${id} user`;
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('Email is exist!');
    }
  }
}
