import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product, Category } from "../types/Product";
import { fetchProducts, fetchCategories } from "../services/productService";
import { addToCart } from "../services/cartService"; // Import the addToCart function
import { toast } from "react-toastify";

function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories and products when the component mounts
  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      try {
        const categoriesData = await fetchCategories();
        const productsData = await fetchProducts();
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData); // Initialize with all products
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load products or categories. Please try again.");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    loadCategoriesAndProducts();
  }, []);

  // Update filtered products based on search query and selected category
  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Add to cart handler
  const handleAddToCart = async (productId: number, quantity: number) => {
    try {
      const result = await addToCart(productId, quantity);
      if (result.success) {
        toast.success("Product added to cart successfully!"); //toast when succ
      } else {
        toast.error("Failed to add product to cart."); // toast when error
        console.error("Failed to add product to cart:", result.message);
      }
    } catch (error) {
      toast.error("Error adding product to cart."); //toast when error
      console.error("Error adding to cart:", error);
    }
  };

  // Display loading indicator
  if (loading) return <div>Loading...</div>;

  // Display error message if data failed to load
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Search input and category filter */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-2 bg-white rounded-md border text-md"
        />

        <select
          className="bg-white border text-md rounded-md px-2 py-1"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart} // Pass the add to cart function
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
