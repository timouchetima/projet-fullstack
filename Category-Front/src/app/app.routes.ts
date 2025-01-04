import { Routes } from '@angular/router';
import {AddCategoryComponent} from './add-category/add-category.component';
import {HomeComponent} from "./home/home.component";
import {EditCategoryComponent} from "./edit-category/edit-category.component";


export const routes: Routes = [
  {
    path: "",
    component:HomeComponent
  },
  {
    path: "AddCategory",
    component:AddCategoryComponent
  },
  { path: 'edit-category/:id',
    component: EditCategoryComponent },
];
