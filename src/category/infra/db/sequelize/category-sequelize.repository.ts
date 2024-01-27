import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.errors";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}
  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(modelProps.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON()
    );
    await this.categoryModel.bulkCreate(modelsProps);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    await this.verifyIfCategoryExists(id);
    const modelToUpdate = CategoryModelMapper.toModel(entity);
    await this.categoryModel.update(modelToUpdate.toJSON(), {
      where: { category_id: id },
    });
  }

  async delete(entity_id: Uuid): Promise<void> {
    await this.verifyIfCategoryExists(entity_id.id);
    await this.categoryModel.destroy({ where: { category_id: entity_id.id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._getCategoryByPk(entity_id.id);
    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  private async verifyIfCategoryExists(id: string) {
    const model = await this._getCategoryByPk(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  private async _getCategoryByPk(id: string) {
    const model = await this.categoryModel.findByPk(id);
    return model;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity(): new (...agrs: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? {
            order: [[props.sort, props.sort_dir]],
          }
        : {
            order: [["created_at", "desc"]],
          }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }
}
