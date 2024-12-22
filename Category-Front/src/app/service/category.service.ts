import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { Category } from './model/category.model';
import { State } from './model/state.model';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categories';

  private add$: WritableSignal<State<Category, HttpErrorResponse>> =
    signal(State.Builder<Category, HttpErrorResponse>().forInit().build());
  addCat = computed(() => this.add$());

  add(category: Category): void {
    const formData = new FormData();
    formData.append('name', category.name!);
  //  formData.append('creationDate', category.creationDate ? category.creationDate.toISOString() : ''); // Permet `null`
    formData.append('parentCategory', category.parentCategory ? JSON.stringify(category.parentCategory) : '');

    formData.append('dto', JSON.stringify({
      ...category,
      parentCategory: undefined,
      //childCategories: undefined
    }));

    this.http.post<Category>(`${this.apiUrl}/create`, formData).subscribe({
      next: savedcateg => this.add$.set(State.Builder<Category, HttpErrorResponse>().forSuccess(savedcateg).build()),
      error: err => this.add$.set(State.Builder<Category, HttpErrorResponse>().forError(err).build()),
    });
  }

  reset(): void {
    this.add$.set(State.Builder<Category, HttpErrorResponse>().forInit().build());
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/AllCategorie`);
  }
}
