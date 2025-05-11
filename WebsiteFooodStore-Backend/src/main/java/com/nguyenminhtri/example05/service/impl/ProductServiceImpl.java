package com.nguyenminhtri.example05.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.CartDTO;
import com.nguyenminhtri.example05.dto.CategoryDTO;
import com.nguyenminhtri.example05.dto.ProductDTO;
import com.nguyenminhtri.example05.dto.ProductInCartDTO;
import com.nguyenminhtri.example05.dto.ProductResponse;
import com.nguyenminhtri.example05.dto.ReviewDTO;
import com.nguyenminhtri.example05.entity.Cart;
import com.nguyenminhtri.example05.entity.Category;
import com.nguyenminhtri.example05.entity.Product;
import com.nguyenminhtri.example05.entity.ProductImage;
import com.nguyenminhtri.example05.entity.Review;
import com.nguyenminhtri.example05.exceptions.APIException;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.CartRepo;
import com.nguyenminhtri.example05.repository.CategoryRepo;
import com.nguyenminhtri.example05.repository.ProductImageRepository;
import com.nguyenminhtri.example05.repository.ProductRepo;
import com.nguyenminhtri.example05.repository.ReviewRepo;
import com.nguyenminhtri.example05.service.CartService;
import com.nguyenminhtri.example05.service.FileService;
import com.nguyenminhtri.example05.service.ProductService;
import com.nguyenminhtri.example05.service.ReviewService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartService cartService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Value("${project.image}")
    private String path;

    @Override
    public ProductDTO addProduct(Long categoryId, Product product) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        boolean isProductNotPresent = true;
        List<Product> products = category.getProducts();

        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getProductName().equals(product.getProductName())
                    && products.get(i).getDescription().equals(product.getDescription())) {
                isProductNotPresent = false;
                break;
            }
        }

        if (isProductNotPresent) {
            product.setImage("default.png");
            product.setCategory(category);
            double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
            product.setSpecialPrice(specialPrice);
            Product savedProduct = productRepo.save(product);
            return modelMapper.map(savedProduct, ProductDTO.class);
        } else {
            throw new APIException("Product already exists!!!");
        }
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        // Create Sort object
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? 
            Sort.by(sortBy).ascending() : 
            Sort.by(sortBy).descending();
        
        // Create Pageable object
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        
        // Get page of products
        Page<Product> pageProducts = productRepo.findAll(pageable);
        
        // Convert to DTOs
        List<ProductDTO> productDTOs = pageProducts.getContent()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
            
        // Create response
        ProductResponse response = new ProductResponse();
        response.setContent(productDTOs);
        response.setPageNumber(pageProducts.getNumber());
        response.setPageSize(pageProducts.getSize());
        response.setTotalElements(pageProducts.getTotalElements());
        response.setTotalPages(pageProducts.getTotalPages());
        response.setLastPage(pageProducts.isLast());
        
        return response;
    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        return mapToDTO(product);
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        try {
            Sort sort = Sort.by(sortBy);
            if (sortOrder.equalsIgnoreCase("desc")) {
                sort = sort.descending();
            } else {
                sort = sort.ascending();
            }

            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
            
            Page<Product> pageProducts = productRepo.findByCategoryCategoryId(categoryId, pageable);
            
            List<ProductDTO> productDTOs = pageProducts.getContent()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
                
            ProductResponse response = new ProductResponse();
            response.setContent(productDTOs);
            response.setPageNumber(pageProducts.getNumber());
            response.setPageSize(pageProducts.getSize());
            response.setTotalElements(pageProducts.getTotalElements());
            response.setTotalPages(pageProducts.getTotalPages());
            response.setLastPage(pageProducts.isLast());
            
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepo.findByProductNameLike("%" + keyword + "%", pageDetails);
        List<Product> products = pageProducts.getContent();

        if (categoryId != 0 && categoryId != null) {
            products = products.stream()
                    .filter(product -> {
                        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
                            Long productCategoryId = product.getCategory().getCategoryId();
                            return productCategoryId.equals(categoryId);
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }

        List<ProductDTO> productDTOS = products.stream().map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements((long) products.size());
        productResponse.setTotalPages((int) Math.ceil((double) products.size() / pageSize));
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(Long productId, Product product) {
        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        product.setImage(productFromDB.getImage());
        product.setProductId(productId);
        product.setCategory(productFromDB.getCategory());

        double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
        product.setSpecialPrice(specialPrice);

        Product savedProduct = productRepo.save(product);

        List<Cart> carts = cartRepo.findCartsByProductId(productId);
        
        // Cập nhật giỏ hàng sử dụng ProductInCartDTO
        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            
            Map<Long, ProductInCartDTO> productMap = new HashMap<>();
            
            cart.getCartItems().forEach(ci -> {
                Product p = ci.getProduct();
                Long pId = p.getProductId();
                
                if (productMap.containsKey(pId)) {
                    ProductInCartDTO existingProduct = productMap.get(pId);
                    existingProduct.setCartQuantity(existingProduct.getCartQuantity() + ci.getQuantity());
                } else {
                    ProductInCartDTO productDTO = modelMapper.map(p, ProductInCartDTO.class);
                    productDTO.setCartQuantity(ci.getQuantity());
                    productMap.put(pId, productDTO);
                }
            });
            
            cartDTO.setProducts(new ArrayList<>(productMap.values()));
            return cartDTO;
        }).collect(Collectors.toList());

        cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        String fileName = fileService.uploadImage(path, image);
        productFromDB.setImage(fileName);

        Product updatedProduct = productRepo.save(productFromDB);

        return modelMapper.map(updatedProduct, ProductDTO.class);
    }

    @Override
    public String deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        List<Cart> carts = cartRepo.findCartsByProductId(productId);
        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

        productRepo.delete(product);

        return "Product with productId: " + productId + " deleted successfully!!!";
    }

    @Override
    public InputStream getProductImage(String fileName) throws FileNotFoundException {
        return fileService.getResource(path, fileName);
    }

    @Override
    public ProductDTO updateAdditionalImages(Long productId, MultipartFile image1, MultipartFile image2, MultipartFile image3) throws IOException {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        ProductImage productImage = productImageRepository.findByProductId(productId)
            .orElse(new ProductImage());
        
        if (image1 != null) {
            String fileName1 = fileService.uploadImage(image1);
            productImage.setImage1(fileName1);
        }
        if (image2 != null) {
            String fileName2 = fileService.uploadImage(image2);
            productImage.setImage2(fileName2);
        }
        if (image3 != null) {
            String fileName3 = fileService.uploadImage(image3);
            productImage.setImage3(fileName3);
        }
        
        productImage.setProduct(product);
        productImageRepository.save(productImage);
        
        return mapToDTO(product);
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        
        // Add additional images if they exist
        ProductImage productImage = productImageRepository.findByProductId(product.getProductId()).orElse(null);
        if (productImage != null) {
            productDTO.setImage1(productImage.getImage1());
            productDTO.setImage2(productImage.getImage2());
            productDTO.setImage3(productImage.getImage3());
        }
        
        // Map category
        if (product.getCategory() != null) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setId(product.getCategory().getCategoryId());
            categoryDTO.setName(product.getCategory().getCategoryName());
            productDTO.setCategory(categoryDTO);
        }

        // Map reviews và rating
        List<Review> reviews = reviewRepo.findByProduct_ProductId(product.getProductId());
        if (reviews != null && !reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            productDTO.setAverageRating(avgRating);
            productDTO.setTotalReviews(reviews.size());

            List<ReviewDTO> reviewDTOs = reviews.stream()
                    .map(review -> {
                        ReviewDTO reviewDTO = new ReviewDTO();
                        reviewDTO.setId(review.getId());
                        reviewDTO.setRating(review.getRating());
                        reviewDTO.setComment(review.getComment());
                        reviewDTO.setUserName(review.getUser().getFirstName());
                        reviewDTO.setCreatedAt(review.getCreatedAt().toString());
                        return reviewDTO;
                    })
                    .collect(Collectors.toList());
            productDTO.setReviews(reviewDTOs);
        } else {
            productDTO.setAverageRating(0.0);
            productDTO.setTotalReviews(0);
            productDTO.setReviews(new ArrayList<>());
        }

        return productDTO;
    }
}
