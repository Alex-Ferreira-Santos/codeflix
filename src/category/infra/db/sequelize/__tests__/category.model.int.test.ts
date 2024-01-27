import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";

describe("CategoryModel Integration Tests", () => {
  it("should create a category", async () => {
    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
    });
    await sequelize.sync({ force: true });

    const category = Category.fake().aCategory().build()
    CategoryModel.create({
      category_id: category.category_id.id,
      name: category.name,
      is_active: category.is_active,
      description: category.description,
      created_at: category.created_at
    })
  });
});
