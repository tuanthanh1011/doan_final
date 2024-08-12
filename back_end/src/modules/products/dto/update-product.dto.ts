import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName: string;

  @IsString()
  @IsOptional()
  subcategory: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  trademark: string;

  @IsString()
  @IsOptional()
  detailName: string;

  @IsNumber()
  @IsOptional()
  increaseTotalSold: number;
}
