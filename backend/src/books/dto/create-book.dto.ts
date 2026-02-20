import { IsString, IsISBN, IsOptional, IsInt, IsPositive, IsUrl, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  isbn: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pages?: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;
}
