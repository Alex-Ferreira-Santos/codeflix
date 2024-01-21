import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsOptional,
  IsBoolean,
} from "class-validator";
import type { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  constructor({ name, description, is_active }: Category) {
    Object.assign(this, { name, description, is_active });
  }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity: Category) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create(){
    return new CategoryValidator()
  }
}