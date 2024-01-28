import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Without Validator Unit Tests", () => {
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });

  describe("constructor", () => {
    it("should create a Category", () => {
      let category = new Category({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it("should create a Category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it("should create a Category with all values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at: created_at,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });
  });

  describe("create command", () => {
    it("should create a Category", () => {
      let category = Category.create({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    it("should create a Category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });
      const validateSpy = jest.spyOn(category, "validate");

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    it("should create a Category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];
    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        category_id: category_id as any,
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  describe("change name", () => {
    it("should change the Category name", () => {
      const category = new Category({
        name: "Movie",
      });
      const validateSpy = jest.spyOn(category, "validate");
      category.changeName("other name");
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe("change description", () => {
    it("should change the Category description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });
      category.changeDescription("other description");
      expect(category.description).toBe("other description");
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe("change is_active", () => {
    it("should active a Category", () => {
      const category = new Category({
        name: "Movie",
      });
      category.activate();
      expect(category.is_active).toBe(true);
      expect(category.notification.hasErrors()).toBe(false);
    });

    it("should deactive a Category", () => {
      const category = new Category({
        name: "Movie",
      });
      category.deactivate();
      expect(category.is_active).toBe(false);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    it("should create an invalid category with name property", () => {
      const category = Category.create({ name: "t".repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });

  describe("change name", () => {
    it("should change the name of a category with an invalid value", () => {
      const category = Category.create({ name: "Movie" });
      category.changeName("t".repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });
});
