import { Category, Product } from "../types/Product";


export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.map((categoryName: string, index: number) => ({
      id: index + 1,
      categoryName,
    }));
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
}


export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
  return response.json();
};
