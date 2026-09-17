import { IsNotEmpty, IsString } from 'class-validator';

export class ContactUserDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
