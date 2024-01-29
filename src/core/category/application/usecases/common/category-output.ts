import { Category } from "../../../domain/category.entity"

export type TCategoryOutput = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
}

export class CategoryOutputMapper{
  static toOutput(entity: Category): TCategoryOutput {
    const {category_id, ...otherProps} = entity.toJSON()
    return {
      id: category_id.id,
      ...otherProps
    }
  }
}