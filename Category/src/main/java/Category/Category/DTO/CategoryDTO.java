package Category.Category.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class CategoryDTO {
    @Setter
    @Getter
    private String name;
    @Setter
    @Getter
    private LocalDate creationDate;
    @Setter
    @Getter
    private Integer childCategoryCount;
    private boolean isRoot;

    public CategoryDTO(String name, LocalDate creationDate, Integer childCategoryCount, boolean isRoot) {
        this.name = name;
        this.creationDate = creationDate;
        this.childCategoryCount = childCategoryCount;
        this.isRoot = isRoot;
    }

    public boolean isRoot() { return isRoot;}

    public void setRoot(boolean isRoot) { this.isRoot = isRoot;}
}
