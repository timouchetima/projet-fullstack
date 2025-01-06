import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { Category } from '../service/model/category.model';
import {map, Observable} from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    DatePipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;

  // Liste des catégories principales
  allCategory$: Observable<Category[]> | undefined;

  // Résultats de recherche
  searchResults$: Observable<Category[]> | undefined;

  // Filtres de recherche
  filters: {
    name?: string;
    isRoot?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    childCategoryCount?: number;
    sortBy?: string;
  } = {}; // Filtres vides au départ

  private categoryService = inject(CategoryService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCategories(); // Charger les catégories principales au démarrage
  }

  // Charger les catégories principales
  loadCategories(): void {
    this.isLoading = true;
    this.allCategory$ = this.categoryService.getCategories();
    this.allCategory$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  // Rechercher les catégories
  searchCategories(): void {
    this.isLoading = true;

    this.searchResults$ = this.categoryService.getCategoriesWithFilters(this.filters).pipe(
      map(response => response.content) // Extract the `content` array
    );

    this.searchResults$.subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('Search results:', data);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error during search:', err);
      }
    });
  }



  // Réinitialiser les filtres de recherche
  resetFilters(): void {
    this.filters = {}; // Réinitialiser les filtres
    this.searchResults$ = undefined; // Supprimer les résultats de recherche
    this.loadCategories(); // Recharger les catégories principales
  }

  // Navigation et suppression
  navigateToEdit(category: Category): void {
    this.router.navigate(['/edit-category', category.id]);
  }

  navigateToDetails(category: Category): void {
    this.router.navigate(['/category-details', category.id]);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.searchCategories(); // Rechercher après suppression
        this.isLoading = false;
      });
    }
  }
}
