import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UsersService {
  private readonly dbPath = join(process.cwd(), 'data', 'users.json');

  async create(createUserDto: CreateUserDto) {
    const users = await this.findAll();

    const exists = users.find(u => u.identificationNumber === createUserDto.identificationNumber);
    if (exists) {
      throw new ConflictException('User with this ID already exists');
    }

    users.push(createUserDto);
    await this.saveToFile(users);
    
    return createUserDto;
  }

  async findAll(): Promise<CreateUserDto[]> {
    try {
      if (!existsSync(this.dbPath)) {
        return [];
      }
      
      const fileContent = await readFile(this.dbPath, 'utf-8');
      const users = JSON.parse(fileContent);
      return Array.isArray(users) ? users : [];

    } catch (error) {
      console.error('Error reading file:', error);
      return [];
      //throw new InternalServerErrorException('Could not load users');
    }
  }

  async findOne(id: number) {
    const users = await this.findAll();
    const user = users.find(user => user.identificationNumber === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user; 
  }

  private async saveToFile(users: CreateUserDto[]) {
    try {
      const dir = dirname(this.dbPath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      await writeFile(this.dbPath, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
      throw new InternalServerErrorException('Could not save data');
    }
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}