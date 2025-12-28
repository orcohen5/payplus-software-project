import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';


export class Customer {
    @IsString()
    @IsNotEmpty()
    fullName : string

    @IsString()
    @IsNotEmpty()
    phone : string

    @IsString()
    @IsNotEmpty()
    email : string

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    birthday : Date
}
