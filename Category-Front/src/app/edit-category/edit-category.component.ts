import { Component, OnInit } from '@angular/core';
import { Category } from '../service/model/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CategoryService } from '../service/category.service';  // Importez votre service

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf
  ],
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  category: Category | undefined;
  categoryId: number = 0;
  editForm: FormGroup;
  categories: Category[] = []; // Liste des catégories pour le select

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,  // Injection du service
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialisation du formulaire avec validation
    this.editForm = this.fb.group({
      name: ['', Validators.required],  // Le nom est requis
      parentCategory: ['']              // Catégorie parent (optionnel)
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID de la catégorie :', id);
    if (id) {
      this.categoryId = +id;  // Convertir en nombre
      this.loadCategory(this.categoryId);  // Charger la catégorie
    }
    this.loadCategories();  // Charger la liste des catégories pour le select
  }

  loadCategory(id: number): void {
    this.categoryService.getCategories().subscribe((categories) => {
      // Trouver la catégorie correspondante par ID
      this.category = categories.find(cat => cat.id === id);
      if (this.category) {
        // Mettre les données de la catégorie dans le formulaire
        this.editForm.patchValue({
          name: this.category.name,
          parentCategory: this.category.parentCategory ? this.category.parentCategory.id : ''
        });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Erreur de récupération des catégories', err),
    });
  }

  submit(): void {
    if (this.editForm.valid && this.category && this.category.id !== undefined) {
      const updatedCategory = this.editForm.value;
      updatedCategory.id = this.category.id;  // Ajoutez l'ID de la catégorie dans les données à mettre à jour

      // Préparer les paramètres à envoyer
      const name = updatedCategory.name;
      const parentCategoryId = updatedCategory.parentCategory ? updatedCategory.parentCategory : null;

      // Affichez les données envoyées pour vérifier qu'elles sont correctes
      console.log('Données de mise à jour de la catégorie:', updatedCategory);

      // Construire l'URL avec les paramètres
      const url = `/api/categories/${this.category.id}?name=${name}` +
        (parentCategoryId ? `&parentId=${parentCategoryId}` : '');

      this.categoryService.updateCategory(url).subscribe({
        next: (category) => {
          console.log('Catégorie mise à jour:', category);
          this.router.navigate(['/']);  // Rediriger après la mise à jour
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          console.error('Erreur HTTP:', err.error);  // Afficher les erreurs spécifiques de l'API
        }
      });
    } else {
      console.error('Le formulaire n\'est pas valide ou la catégorie est manquante.');
    }
  }



}
