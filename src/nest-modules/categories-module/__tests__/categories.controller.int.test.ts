import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CategoriesController } from '../categories.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { CategoriesModule } from '../categories.module';
import { CATEGORY_PROVIDERS } from '../categories.providers';
import { CreateCategoryUseCase } from '@core/category/application/usecases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/usecases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/usecases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/usecases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/usecases/list-categories/list-categories.use-case';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase)
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase)
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase)
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase)
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase)
  })

});
