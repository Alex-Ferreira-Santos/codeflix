import { ListCategoriesInput } from '@core/category/application/usecases/list-categories/list-categories.use-case';
import { TSortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDTO implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: TSortDirection;
  filter?: string;
}
