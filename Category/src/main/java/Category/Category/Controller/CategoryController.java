package Category.Category.Controller;


import Category.Category.DTO.CategoryDTO;
import Category.Category.Repository.CategoryRepository;
import Category.Category.Service.CategoryService;
import Category.Category.Entite.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestParam String name, @RequestParam(required = false) Long parentId) {
        // Récupérer la catégorie parente si l'ID est fourni
        Category parentCategory = null;
        if (parentId != null) {
            parentCategory = categoryRepository.findById(parentId).orElse(null);
        }
        Category createdCategory = categoryService.createCategory(name, parentCategory);
        return ResponseEntity.ok(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestParam String name, @RequestParam(required = false) Long parentId) {
        Category parentCategory = parentId != null ?  categoryRepository.findById(parentId).orElse(null) : null;
        Category updatedCategory = categoryService.updateCategory(id, name, parentCategory);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Category>> getAllCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryRepository.findAll(pageable));
    }
    @GetMapping("/AllCategorie")
    public ResponseEntity<List<Category>> getAllCategoriesbien() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryDetails(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CategoryDTO>> searchCategories(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean isRoot,
            @RequestParam(required = false) LocalDateTime createdAfter,
            @RequestParam(required = false) LocalDateTime createdBefore,
            @RequestParam(required = false) Integer childCategoryCount,
            @RequestParam(required = false) String sortBy, // 'date' ou 'childCount'
            Pageable pageable) {

        // Créer la spécification de recherche
        Specification<Category> spec = Specification.where(null);

        // Appliquer les filtres
        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (isRoot != null) {
            spec = spec.and((root, query, cb) -> isRoot ? cb.isNull(root.get("parentCategory")) : cb.isNotNull(root.get("parentCategory")));
        }

        if (createdAfter != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("creationDate"), createdAfter));
        }

        if (createdBefore != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("creationDate"), createdBefore));
        }

        if (childCategoryCount != null) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.size(root.get("childCategories")), childCategoryCount));
        }

        // Trier selon le paramètre 'sortBy' (date ou nombre d'enfants)
        Pageable sortedPageable;
        if ("date".equals(sortBy)) {
            sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Order.asc("creationDate")));
        } else if ("childCount".equals(sortBy)) {
            sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Order.asc("childCategories.size")));
        } else {
            sortedPageable = pageable; // Utiliser le Pageable passé si aucun tri spécifique
        }

        // Effectuer la recherche avec les filtres et pagination
        Page<Category> categories = categoryRepository.findAll(spec, sortedPageable);

        // Convertir les catégories en DTO pour l'affichage
        Page<CategoryDTO> categoryDTOs = categories.map(this::convertToDTO);

        return ResponseEntity.ok(categoryDTOs);
    }

    private CategoryDTO convertToDTO(Category category) {
        // Vérifie si la catégorie a des enfants
        Integer childCount = (category.getChildCategories() != null) ? category.getChildCategories().size() : 0;

        // Détermine si la catégorie est une catégorie racine (pas de parent)
        boolean isRoot = category.isRootCategory();

        // Crée et retourne le DTO
        return new CategoryDTO(
                category.getName(),
                category.getCreationDate(),
                childCount,
                isRoot
        );
    }

    @GetMapping("/recherche")
    public Page<Category> searchCategories(
            @RequestParam(required = false) Boolean isRootCategory,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdAfter,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdBefore,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(required = false) String sortBy,
            Pageable pageable) {

        // Recherche en fonction des filtres
        if (isRootCategory != null && isRootCategory) {
            if (startDate != null && endDate != null) {
                return categoryRepository.findByParentCategoryIsNullAndCreationDateBetween(startDate, endDate, pageable);
            } else if (createdAfter != null) {
                return categoryRepository.findByParentCategoryIsNullAndCreationDateAfter(createdAfter, pageable);
            } else if (createdBefore != null) {
                return categoryRepository.findByParentCategoryIsNullAndCreationDateBefore(createdBefore, pageable);
            } else {
                return categoryRepository.findByParentCategoryIsNull(pageable); // Filtrer par racine sans date
            }
        }

        // Recherche par tri
        if ("name".equals(sortBy)) {
            return categoryRepository.findAllByOrderByNameAsc(pageable);
        } else if ("creationDate".equals(sortBy)) {
            return categoryRepository.findAllByOrderByCreationDateAsc(pageable);
        }

        return categoryRepository.findAll(pageable); // Par défaut, renvoie toutes les catégories
    }

}
