import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getCartItems,
  deleteCartItem,
  updateCartItem,
} from "../services/cartService";
import { Trash2 } from "lucide-react";
import { Root, CartItem } from "../types/Product";
import QuantityControl from "./QuantityControl";

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Holds cart items
  const [totalCost, setTotalCost] = useState(0); // Holds total cart cost
  const [error, setError] = useState<string | null>(null); // Holds error messages if any
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing. Redirecting to login.");
        }

        // Fetch cart items and set state
        const data: Root = await getCartItems(token);
        setCartItems(data.cartItems);
        setTotalCost(data.totalCost);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Token is missing. Redirecting to login.") {
            router.push("/login"); // Redirect if token is missing
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
    // Calculate the total cost of all cart items
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalCost(total);
  };

  const handleIncreaseQuantity = async (itemId: number) => {
    // Increase the quantity of a specific cart item
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
        itemToUpdate.product.id
      );
    }
  };

  const handleDecreaseQuantity = async (itemId: number) => {
    // Decrease the quantity of a specific cart item or remove it if quantity reaches 1
    const itemToUpdate = cartItems.find((item) => item.id === itemId);
    if (itemToUpdate) {
      if (itemToUpdate.quantity === 1) {
        // Remove item from cart if quantity is 1
        await deleteCartItem(itemId, localStorage.getItem("token"));
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
      } else {
        // Decrease quantity if it's greater than 1
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
          itemToUpdate.quantity - 1,
          itemToUpdate.product.id
        );
      }
    }
  };

  const handleCompletePayment = () => {
    // Prepare and store checkout list in localStorage, then redirect to order page
    const checkoutList = cartItems.map((item) => ({
      price: item.product.price,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      userId: 1,
    }));

    localStorage.setItem("checkoutList", JSON.stringify(checkoutList));
    router.push("/order");
  };

  const handleRemoveItem = async (itemId: number) => {
    // Remove a specific item from the cart and update the total cost
    const token = localStorage.getItem("token");
    await deleteCartItem(itemId, token);
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    calculateTotalCost(updatedItems);
  };

  const truncateTitle = (title: string) => {
    // Truncate title to 15 characters for small screens
    return title.length > 15 ? `${title.substring(0, 15)}...` : title;
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
      <div className="container mx-auto p-4">
        <div className="p-4 bg-white rounded-lg shadow-4xl">
          <div className="flex flex-col mb-6">
            <h2 className="text-lg flex items-center justify-start gap-2">
              سلة المشتريات
            </h2>
          </div>
          <ul className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md transition-all hover:bg-gray-100"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    className="rounded-md w-[60px] h-[60px] object-cover"
                    src={item.product.imageURL}
                    alt="Product Thumbnail"
                  />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-center sm:text-left">
                      {/* Truncate title for small screens */}
                      <span className="sm:hidden">
                        {truncateTitle(item.product.name)}
                      </span>
                      <span className="hidden sm:inline">
                        {item.product.name}
                      </span>
                    </h4>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <b>{`x ${item.quantity}`}</b>
                      <span className="text-xs text-gray-500">{`${
                        item.product.price * item.quantity
                      } SAR`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
                  {/* Quantity control component */}
                  <QuantityControl
                    quantity={item.quantity}
                    onIncrease={() => handleIncreaseQuantity(item.id)}
                    onDecrease={() => handleDecreaseQuantity(item.id)}
                  />
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-8 border-gray-100 border-t">
            <h3 className="font-bold text-xl text-center sm:text-left">
              اجمالي السلة
            </h3>
            <span className="text-xl font-bold">{`${totalCost} SAR`}</span>
          </div>
          <button
            type="button"
            className="w-full bg-primary text-white p-3 text-md rounded-md mt-4"
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
