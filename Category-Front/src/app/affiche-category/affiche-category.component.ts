import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CategoryService } from '../service/category.service';  // Importez votre service
import {CommonModule} from "@angular/common";  // Import your service to fetch category data

@Component({
  selector: 'app-affiche-category',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './affiche-category.component.html',
  styleUrls: ['./affiche-category.component.scss']
})
export class AfficheCategoryComponent implements OnInit {
  categoryId: number | undefined;
  categoryData: any;  // To hold the category data

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService  // Inject your category service
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = +id;  // Convert string to number
      console.log('ID de la catégorie :', this.categoryId);

      // Fetch category data from the service using the ID
      this.categoryService.getCategoryById(this.categoryId).subscribe((data) => {
        this.categoryData = data;
        console.log('Category data:', this.categoryData);
      });
    }
  }
}
