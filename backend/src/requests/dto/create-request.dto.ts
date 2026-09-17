import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TimePreferenceSlotDto {
  @IsString()
  day!: string;

  @IsString()
  start!: string;

  @IsString()
  end!: string;
}

export class CreateRequestDto {
  @IsInt()
  childGrade!: number;

  @IsString()
  subject!: string;

  @IsNumber()
  @Min(0)
  budgetMin!: number;

  @IsNumber()
  @Min(0)
  budgetMax!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TimePreferenceSlotDto)
  timePreference!: TimePreferenceSlotDto[];

  @IsString()
  region!: string;
}
