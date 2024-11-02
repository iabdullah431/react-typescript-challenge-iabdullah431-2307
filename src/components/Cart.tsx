import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getCartItems,
  deleteCartItem,
  updateCartItem,
} from "../services/cartService";
import { Trash2 } from "lucide-react"; // Delete icon
import { Root, CartItem } from "../types/Product"; // Import data types

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing. Redirecting to login.");
        }

        const data: Root = await getCartItems(token); // Retrieve cart data
        setCartItems(data.cartItems); // Set cart items
        setTotalCost(data.totalCost); // Set total cost
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Token is missing. Redirecting to login.") {
            router.push("/login"); // Redirect to login if token is missing
          } else {
            setError(error.message);
          }
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchCartItems();
  }, [router]);

  const calculateTotalCost = (items: CartItem[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalCost(total);
  };

  const handleIncreaseQuantity = async (itemId: number) => {
    // Increase the quantity of the specified item
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCartItems(updatedItems);
    calculateTotalCost(updatedItems);

    const itemToUpdate = updatedItems.find((item) => item.id === itemId);
    if (itemToUpdate) {
      await updateCartItem(
        itemToUpdate.id,
        itemToUpdate.quantity,
        itemToUpdate.product.id // Correctly pass the product ID
      );
    }
  };

  const handleDecreaseQuantity = async (itemId: number) => {
    const itemToUpdate = cartItems.find((item) => item.id === itemId);
    if (itemToUpdate) {
      if (itemToUpdate.quantity === 1) {
        // If quantity is 1, remove the item
        await deleteCartItem(itemId, localStorage.getItem("token"));
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
      } else {
        // Decrease the quantity by 1 if more than 1
        const updatedItems = cartItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });

        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);

        await updateCartItem(
          itemToUpdate.id,
          itemToUpdate.quantity - 1, // Update to new quantity
          itemToUpdate.product.id
        );
      }
    }
  };

  const handleCompletePayment = () => {
    // Prepare checkout data and redirect to order confirmation
    const checkoutList = cartItems.map(item => ({
      price: item.product.price,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      userId: 1 // Replace with actual user ID if available
    }));

    localStorage.setItem("checkoutList", JSON.stringify(checkoutList)); // Store checkout list
    router.push('/order'); // Redirect to order confirmation page
  };

  const handleRemoveItem = async (itemId: number) => {
    // Remove item from cart and update state
    const token = localStorage.getItem("token");
    await deleteCartItem(itemId, token);
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    calculateTotalCost(updatedItems);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-500">
        عذراً، لا توجد لديك أي طلبات في السلة.
      </div>
    );
  }
 

  return (
    <main className="w-full main flex-auto">
      <div className="container">
        <div className="p-4 bg-white rounded-lg shadow-4xl">
          <div className="flex flex-col mb-6">
            <h2 className="text-lg flex items-center justify-start gap-2">
              سلة المشتريات
            </h2>
          </div>
          <ul className="flex flex-col">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 w-full p-4 rounded-md transition-all hover:bg-gray-100"
              >
                <div className="flex items-start justify-center gap-2 flex-1">
                  <img
                    className="rounded-md w-[60px] h-[60px] object-cover"
                    src={item.product.imageURL}
                    alt="Product Thumbnail"
                  />
                  <div className="flex flex-col flex-1 gap-1">
                    <h4>{item.product.name}</h4>
                    <div className="flex items-center justify-start gap-2">
                      <b>{`x ${item.quantity}`}</b>
                      <span className="text-xs text-gray-500">{`${
                        item.product.price * item.quantity
                      } SAR`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="border border-gray-300 rounded-lg px-2"
                    onClick={() => handleDecreaseQuantity(item.id)}
                  >
                    {" "}
                    -{" "}
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="border border-gray-300 rounded-lg px-2"
                    onClick={() => handleIncreaseQuantity(item.id)}
                  >
                    {" "}
                    +{" "}
                  </button>
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 size={20} /> {/* Delete icon */}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-4 py-8 border-gray-100 border-t border-b-1">
            <h3 className="font-bold text-xl">اجمالي السلة</h3>
            <span className="text-xl font-bold">{`${totalCost} SAR`}</span>
          </div>
          <button
            type="button"
            className="w-full bg-primary text-white p-3 text-md rounded-md"
            onClick={handleCompletePayment}
          >
            اتمام عملية الدفع
          </button>
        </div>
      </div>
    </main>
  );
}

export default Cart;
