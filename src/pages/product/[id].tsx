import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "../../types/Product";
import MainHeader from "@/src/components/MainHeader";
import { addToCart } from "@/src/services/cartService";
import { fetchProductById } from "@/src/services/productService";
import { toast } from 'react-toastify'; 

function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const productData = await fetchProductById(Number(id)); // Fetch product by ID
          setProduct(productData); // Set the product data to state
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };
    
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return; // Ensure the product exists
    try {
      const result = await addToCart(product.id, quantity);
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

  if (!product) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50">
      <MainHeader />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6 flex flex-col md:flex-row gap-6 min-h-[400px]">
        
        {/* Product Image */}
        <div className="flex justify-center lg:w-1/4 md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 aspect-[4/3] object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between md:w-3/4">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">{product.title}</h1>
            <small className="text-xs text-gray-500">{product.category}</small>
            <div className="flex items-center my-4 gap-2">
              <span className="font-medium text-md text-primary">{product.price} SAR</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{product.description}</p>
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-gray-600">+</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // Add onChange handler
                className="w-16 text-center border-l border-r border-gray-300 outline-none" 
              />
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-gray-600">-</button>
            </div>

            <button 
              type="button" 
              className="flex-1 bg-primary text-white py-2 rounded-md text-md font-semibold w-full md:w-auto"
              onClick={handleAddToCart} // Call the function directly
            >
              اضافه للسله
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
