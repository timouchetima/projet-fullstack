package Category.Category.Repository;
import Category.Category.Entite.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Page<Category> findAll(Specification<Category> spec, Pageable sortedPageable);
    // Recherche avec filtre sur les catégories racines et la date de création
    Page<Category> findByParentCategoryIsNullAndCreationDateAfter(LocalDate date, Pageable pageable);

    // Recherche avec filtre sur les catégories racines et la date avant une certaine date
    Page<Category> findByParentCategoryIsNullAndCreationDateBefore(LocalDate date, Pageable pageable);

    // Recherche avec un intervalle de dates
    Page<Category> findByParentCategoryIsNullAndCreationDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Recherche en fonction de l'ordre de tri par nom
    Page<Category> findAllByOrderByNameAsc(Pageable pageable);

    // Recherche en fonction de l'ordre de tri par date de création
    Page<Category> findAllByOrderByCreationDateAsc(Pageable pageable);

    // Recherche en fonction du nombre de catégories enfant
    @Query("SELECT c FROM Category c WHERE size(c.childCategories) = :childCount")
    Page<Category> findByChildCategoriesCount(int childCount, Pageable pageable);

    Page<Category> findByParentCategoryIsNull(Pageable pageable);
}
