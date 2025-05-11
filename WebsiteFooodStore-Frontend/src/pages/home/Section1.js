import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import { Link } from "react-router-dom";
import startsActive from "../../assets/images/icons/stars-active.svg";
import './Section1.css';

const Section1 = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const params = {
                    pageNumber: 0,
                    pageSize: 5,
                    sortBy: 'productId',
                    sortOrder: 'asc'
                };

                // Fetch products from multiple categories
                const categoryIds = [7, 8];
                const results = await Promise.all(
                    categoryIds.map(async (id) => {
                        const response = await GET_ALL(`categories/${id}/products`, params);
                        const categoryInfo = await GET_ALL(`categories/${id}`);
                        return {
                            categoryId: id,
                            categoryName: categoryInfo.name,
                            products: response.content || []
                        };
                    })
                );

                setCategoryProducts(results);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="section-products">
            {categoryProducts.map((category) => (
                <section key={category.categoryId} className="padding-bottom">
                    <header className="section-heading mb-4">
                        <h3 className="title-section">{category.categoryName}</h3>
                    </header>
                    <div className="row">
                        {category.products.length > 0 ? (
                            category.products.map((product) => (
                                <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={product.id}>
                                    <div className="card card-product-grid">
                                        <Link to={`/Detail/${product.productId}`} className="img-wrap">
                                            <img 
                                                src={`http://localhost:8080/api/public/products/image/${product.image}`}
                                                alt={product.productName}
                                                className="product-image"
                                            />
                                        </Link>
                                        <figcaption className="info-wrap">
                                            <ul className="rating-stars mb-1">
                                                <li style={{ width: "80%" }} className="stars-active">
                                                    <img src={startsActive} alt="" />
                                                </li>
                                            </ul>
                                            <div>
                                                <Link to={`/Detail/${product.productId}`} className="title">
                                                    {product.productName}
                                                </Link>
                                            </div>
                                            <div className="price h5 mt-2">${product.price}</div>
                                        </figcaption>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p>Không có sản phẩm nào trong danh mục này.</p>
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Section1;