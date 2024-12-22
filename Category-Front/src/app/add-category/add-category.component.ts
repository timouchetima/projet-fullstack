import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../service/model/category.model';
import { CategoryService } from '../service/category.service';
import { Router } from '@angular/router';
import { CreateCategoryFormContent } from './add-category-form.model';
import { CommonModule } from '@angular/common';

type FlowStatus = 'init' | 'validation-name-error' | 'validation-date-error' | 'success' | 'error';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, FontAwesomeModule,CommonModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  categories: Category[] = [];

  isCreating = false;
  flowStatus: FlowStatus = 'init';
  ngOnInit(): void {
    // Récupérer les catégories depuis le service
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories);
    });

  }

  public createForm = this.formBuilder.group<CreateCategoryFormContent>({
    name: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required] }),
   // creationDate: this.formBuilder.control<Date | null>(null, { nonNullable: false }), // Permet `null`
    parentCategory: this.formBuilder.control<string | null>(null, { nonNullable: false }) // Permet `null`
    //childCategories: this.formBuilder.control<Category[] | null>(null, { nonNullable: false }) // Permet `null`
  });
  constructor() {
    effect(() => {
      this.isCreating = false;
      if(this.categoryService.addCat().status === "OK") {
        //   this.categoryService.getAll();
      //  this.categoryService.show('Song created with success', "SUCCESS");
        this.router.navigate(['/']);
      } else if (this.categoryService.addCat().status === "ERROR") {
        //  this.toastService.show('Error occured when creating song, please try again', "DANGER");
      }
    });
  }

  create(): void {
    this.isCreating = true;

    if (this.createForm.invalid) {
      this.flowStatus = this.createForm.controls.name.invalid ? 'validation-name-error' : 'validation-date-error';
      this.isCreating = false;
      return;
    }

    const categToCreate: Category = {
      name: this.createForm.value.name!,
      // creationDate: this.createForm.value.creationDate ?? undefined, // Gérer `null` comme `undefined`
      parentCategory: this.createForm.value.parentCategory ? JSON.parse(this.createForm.value.parentCategory) : undefined,
      // childCategories: this.createForm.value.childCategories ?? undefined
    };

    this.categoryService.add(categToCreate);
  }
  ngOnDestroy(): void {
    this.categoryService.reset();
  }
}
