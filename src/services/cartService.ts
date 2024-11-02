import { Root } from "../types/Product";

// Function to get cart items from the backend
export async function getCartItems(token: string): Promise<Root> { 
    if (!token) {
      throw new Error("Token is missing. Redirecting to login.");
    }
  
    const response = await fetch(
      `https://limitless-lake-55070.herokuapp.com/cart/?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to retrieve cart items");
    }
  
    const data: Root = await response.json(); // Use the Root type here
    return data;
  }

// Function to add a product to the cart
export async function addToCart(productId: number, quantity: number) {
  const token = localStorage.getItem("token"); // Get the token from local storage
  if (!token) {
    return { success: false, message: "Token is missing. Please log in again." }; // Return an error message without throwing an exception
  }

  try {
    const response = await fetch(
      `https://limitless-lake-55070.herokuapp.com/cart/add?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Retrieve error text from the response
      return { success: false, message: errorText || "Failed to add to cart." };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: "An error occurred while adding to cart. Please try again.",
    };
  }
}

export async function deleteCartItem(itemId: number, token: string | null): Promise<void> {
    if (!token) {
      throw new Error("Token is missing. Cannot delete item.");
    }
  
    const response = await fetch(`https://limitless-lake-55070.herokuapp.com/cart/delete/${itemId}?token=${token}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete cart item");
    }
  }
  

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
  productId: number
) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token is missing. Redirecting to login.");
  }

  const body = {
    id: cartItemId, // ID of the cart item
    productId: productId, // Product ID of the product in the cart
    quantity: quantity, // New quantity
  };

  try {
    const response = await fetch(
      `https://limitless-lake-55070.herokuapp.com/cart/update/${cartItemId}?token=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send the body as JSON
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update cart item");
    }

    const data = await response.json();
    return data; // Return the response data
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error; // Rethrow the error to be handled in the calling function
  }
}
