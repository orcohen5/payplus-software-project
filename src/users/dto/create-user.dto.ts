import { IsString, IsNotEmpty, Min, IsNumber, Max } from 'class-validator';

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(10000)
    @Max(999999999)
    identificationNumber : number

    @IsString()
    fullName : string

    @IsString()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string
}