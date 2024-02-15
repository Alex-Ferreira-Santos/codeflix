import { ListCategoriesInput } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import { TSortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: TSortDirection;
  filter?: string;
}
