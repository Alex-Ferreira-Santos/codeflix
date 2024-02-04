import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { CategoriesModule } from './categories.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { ConfigService } from '@nestjs/config';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
