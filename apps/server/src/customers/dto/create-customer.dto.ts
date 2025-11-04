import { IsOptional, IsString, IsEmail, MaxLength } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;
}
