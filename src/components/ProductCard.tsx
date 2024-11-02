import React from "react";
import Link from "next/link";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void; // Define the onAddToCart prop
}

function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { id, title, price, description, category, image, rating } = product;

  // Shorten the description if it's too long
  const shortDescription = description.length > 60 ? `${description.slice(0, 60)}...` : description;

  return (
    <div className="rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-between h-full shadow-md hover:shadow-lg transition-shadow">
      {/* Link to Product Details Page */}
      <Link href={`/product/${id}`}>
        <img src={image} alt={title} className="rounded-lg object-cover h-32 w-full mb-4 cursor-pointer" />
      </Link>

      <h2 className="text-sm text-primary font-semibold text-center mb-1">{title}</h2>
      <p className="text-xs text-gray-500 text-center mb-2">{shortDescription}</p>
      <span className="text-xs text-gray-400 mb-2">التصنيف: {category}</span>

      <div className="mt-2 text-center">
        <span className="text-md font-semibold text-primary">{price} SAR</span>
      </div>

      <div className="mt-1 text-xs text-gray-500">
        تقييم: {rating.rate} / 5 ({rating.count} تقييم)
      </div>

      <button
        className="mt-4 w-full bg-primary text-white p-2 text-sm rounded-md"
        onClick={() => onAddToCart(id, 1)} // Call the function with a quantity of 1
      >
        إضافة للسلة
      </button>
    </div>
  );
}

export default ProductCard;

