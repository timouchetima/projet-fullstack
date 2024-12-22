import { FormControl } from "@angular/forms";
import { Category } from "../service/model/category.model";

export type CreateCategoryFormContent = {
  name: FormControl<string>;
  // creationDate: FormControl<Date | null>;
  parentCategory: FormControl<string | null>;
  //childCategories: FormControl<Category[] | null>;
};
