package com.nguyenminhtri.example05.service;
import com.nguyenminhtri.example05.dto.CategoryDTO;
import com.nguyenminhtri.example05.dto.CategoryResponse;
import com.nguyenminhtri.example05.entity.Category;
public interface CategoryService {
CategoryDTO createCategory (Category category);
CategoryResponse getCategories (Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
CategoryDTO getCategoryById(Long categoryId);
CategoryDTO updateCategory (Category category, Long categoryId);
String deleteCategory (Long categoryId);
}