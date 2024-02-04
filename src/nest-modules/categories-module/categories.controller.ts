import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CreateCategoryUseCase } from '@core/category/application/usecases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/usecases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/usecases/delete-category/delete-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/usecases/list-categories/list-categories.use-case';
import { GetCategoryUseCase } from '@core/category/application/usecases/get-category/get-category.use-case';
import { CategoryPresenter } from './categories.presenter';
import { TCategoryOutput } from '@core/category/application/usecases/common/category-output';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteeUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  findAll() {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      description: updateCategoryDto.description,
      is_active: updateCategoryDto.is_active,
      name: updateCategoryDto.name,
    });
    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteeUseCase.execute({ id });
  }

  static serialize(output: TCategoryOutput) {
    return new CategoryPresenter(output);
  }
}
