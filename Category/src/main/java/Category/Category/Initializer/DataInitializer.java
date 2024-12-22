package Category.Category.Initializer;

import Category.Category.Entite.Category;
import Category.Category.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
    }

    private void initializeCategories() {
        Category rootCategory1 = new Category();
        rootCategory1.setName("fati");
        rootCategory1.setCreationDate(LocalDate.now());
        rootCategory1.setParentCategory(null);  // racine
        categoryRepository.save(rootCategory1);

        Category rootCategory2 = new Category();
        rootCategory2.setName("Catégorie Racine 2");
        rootCategory2.setCreationDate(LocalDate.now());
        rootCategory2.setParentCategory(null);  //racine
        categoryRepository.save(rootCategory2);

        Category childCategory1 = new Category();
        childCategory1.setName("Sous-Catégorie 1.1");
        childCategory1.setCreationDate(LocalDate.now());
        childCategory1.setParentCategory(rootCategory1);  // Parent : racine 1
        categoryRepository.save(childCategory1);

        Category childCategory2 = new Category();
        childCategory2.setName("Sous-Catégorie 1.2");
        childCategory2.setCreationDate(LocalDate.now());
        childCategory2.setParentCategory(rootCategory1);  // Parent : racine 1
        categoryRepository.save(childCategory2);

        Category childCategory3 = new Category();
        childCategory3.setName("Sous-Catégorie 2.1");
        childCategory3.setCreationDate(LocalDate.now());
        childCategory3.setParentCategory(rootCategory2);  // Parent : racine 2
        categoryRepository.save(childCategory3);
    }
}
