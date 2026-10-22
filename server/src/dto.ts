import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class CreateWorkspaceDto {
  @Transform(trim) @IsString() @Length(1, 120) name!: string;
  @Transform(trim) @IsString() @Length(1, 120) siteName!: string;
}

export class CreateAssetDto {
  @IsUUID() siteId!: string;
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
  @IsString() @Length(1, 80) assetTag!: string;
  @Transform(trim) @IsString() @Length(1, 120) name!: string;
  @IsOptional() @Transform(trim) @IsString() @Length(0, 120) manufacturer?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(0, 120) model?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(0, 120) serialNumber?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(0, 2000) notes?: string;
}

export class PageQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100000) page = 1;
  @IsOptional() @Transform(trim) @IsString() @Length(0, 120) search = '';
}
