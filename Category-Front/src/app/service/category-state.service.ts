import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from './model/category.model'; // Si nécessaire, ajustez l'importation selon votre projet

@Injectable({
  providedIn: 'root',
})
export class CategoryStateService {
  private categorySubject = new BehaviorSubject<Category | null>(null); // Stocke l'état de la catégorie
  category$ = this.categorySubject.asObservable(); // Observable que les composants peuvent souscrire

  // Méthode pour définir la catégorie
  setCategory(category: Category): void {
    this.categorySubject.next(category);
  }

  // Méthode pour récupérer la catégorie
  getCategory(): Category | null {
    return this.categorySubject.value;
  }
}
