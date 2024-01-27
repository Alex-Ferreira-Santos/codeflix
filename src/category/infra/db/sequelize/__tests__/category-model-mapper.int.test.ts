import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

describe("CategoryModelMapper Integration Tests", () => {
  let sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
  });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "dfd135e4-d321-446a-ad30-70ea9f21d48c",
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect((error as EntityValidationError).errors).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "781a1de8-7970-460f-8546-681253930976",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });

    const aggreagate = CategoryModelMapper.toEntity(model);
    expect(aggreagate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("781a1de8-7970-460f-8546-681253930976"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  it("should convert a category category entity to a model", () => {
    const created_at = new Date();
    const entity = new Category({
      category_id: new Uuid("781a1de8-7970-460f-8546-681253930976"),
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });

    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual({
      category_id: "781a1de8-7970-460f-8546-681253930976",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});
