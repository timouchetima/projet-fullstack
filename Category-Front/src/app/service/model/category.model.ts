export interface Category {
  id?: number;
  name?: string;
  creationDate?: Date;
  parentCategory?: Category;
  childCategories?: Category[];
}
