package Category.Category.Service;

import Category.Category.Repository.CategoryRepository;
import Category.Category.Entite.Category;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(String name, Category parentCategory) {
        Category category = new Category();
        category.setName(name);
        category.setParentCategory(parentCategory);
        if (category.isChildOfItself()) {
            throw new IllegalArgumentException("Une catégorie ne peut pas être son propre parent.");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, Category parentCategory) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            Category category = existingCategory.get();
            category.setName(name);
            category.setParentCategory(parentCategory);
            if (category.isChildOfItself()) {
                throw new IllegalArgumentException("Une catégorie ne peut pas être son propre parent.");
            }
            return categoryRepository.save(category);
        } else {
            throw new IllegalArgumentException("Catégorie non trouvée.");
        }
    }
}
