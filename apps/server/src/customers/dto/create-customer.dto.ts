import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, MaxLength } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: "Nome do cliente" })
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({ description: "Email do cliente" })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: "Telefone do cliente" })
  phone?: string;
}
