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

export class AvailabilitySlotDto {
  @IsString()
  day!: string;

  @IsString()
  start!: string;

  @IsString()
  end!: string;
}

export class CreateTutorProfileDto {
  @IsString()
  college!: string;

  @IsString()
  major!: string;

  @IsInt()
  grade!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  subjects!: string[];

  @IsNumber()
  @Min(0)
  pricePerHour!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availableTimes!: AvailabilitySlotDto[];
}
