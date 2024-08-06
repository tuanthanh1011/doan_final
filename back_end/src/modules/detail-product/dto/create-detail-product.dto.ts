import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDetailProductDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsNotEmpty()
  product: string;
}
