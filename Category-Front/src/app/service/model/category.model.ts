export interface Category {
  id?: number;
  name?: string;
  creationDate?: Date;
  parentCategory?: Category;
  childCategories?: Category[];
}
export interface CategoryList {
  id?: number;
  name?: string;
  creationDate?: Date;  // Utilisez string car la date est renvoyée sous forme de chaîne ISO
  rootCategory?: boolean;  // Nouveau champ pour vérifier si c'est une catégorie racine
  childCategories?: Category[];  // Liste des sous-catégories
  childOfItself?: boolean;  // Vérifie si la catégorie est enfant d'elle-même
}
