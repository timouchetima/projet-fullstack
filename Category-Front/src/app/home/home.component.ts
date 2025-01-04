import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { Category } from '../service/model/category.model';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  allCategory$: Observable<Category[]> | undefined;

  private categoryService = inject(CategoryService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.allCategory$ = this.categoryService.getCategories();
    this.allCategory$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Ajouter un message d'erreur ou gérer l'erreur
      }
    });
  }
  deleteCategory(id: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.isLoading = true;
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error deleting category:', err);
        }
      });
    }
  }
  // Méthode pour naviguer vers la page d'édition
  navigateToEdit(category: Category): void {
    console.log('Navigating to edit with category:', category); // Log category being passed
    this.router.navigate(['/edit-category', category.id]); // Or with state: { state: { category } }
  }



}
