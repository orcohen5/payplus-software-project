import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export interface Customer extends CreateCustomerDto {
  id: string;
  userId: number;
}

@Injectable()
export class CustomersService {
  private readonly filePath = join(process.cwd(), 'data', 'customers.json');

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    const customers = await this.getAllFromFile();

    const newCustomer: Customer = {
      ...createCustomerDto,
      id: createCustomerDto.email,
      userId: userId
    };

    customers.push(newCustomer);
    await this.saveToFile(customers);
    
    return newCustomer;
  }

  async findAll(userId: number) {
    const allCustomers = await this.getAllFromFile();

    return allCustomers.filter(customer => customer.userId === userId);
  }

  async findOne(email: string, userId: number) {
    const customers = await this.getAllFromFile();
    
    const customer = customers.find(c => c.email === email && c.userId === userId);

    if (!customer) {
      throw new NotFoundException('Customer not found or you do not have permission');
    }

    return customer;
  }

  private async getAllFromFile(): Promise<Customer[]> {
    try {
      if (!existsSync(this.filePath)) return [];
      const fileContent = await readFile(this.filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  private async saveToFile(customers: Customer[]) {
    try {
      const dir = dirname(this.filePath);

      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      await writeFile(this.filePath, JSON.stringify(customers, null, 2));
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Could not save customer');
    }
  }


  
  update(email: string, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${email} customer`;
  }

  remove(email: string) {
    return `This action removes a #${email} customer`;
  }
}