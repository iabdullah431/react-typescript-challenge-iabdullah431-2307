import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { placeOrder } from '../services/orderService';
import { CheckoutItemDto } from '../types/Product';

const OrderConfirmation = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checkoutList, setCheckoutList] = useState<CheckoutItemDto[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const storedCheckoutList = localStorage.getItem("checkoutList");
    if (storedCheckoutList) {
      const parsedList = JSON.parse(storedCheckoutList);
      setCheckoutList(parsedList);
      // Calculate total price
      const total = parsedList.reduce((acc: number, item: CheckoutItemDto) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    }
  }, []);

  const handleConfirmOrder = async () => {
    if (!token) {
      setError('Token is not available. Please log in again.');
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setError('Session ID is missing. Please try again.');
        return;
      }

      const result = await placeOrder(checkoutList, token, sessionId);
      setSuccessMessage('Order placed successfully!');

      localStorage.removeItem("checkoutList");
      setCheckoutList([]);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center">Confirm Your Order</h2>
      {checkoutList.length > 0 ? (
        <>
          {/* Table headers */}
          <div className="flex justify-between w-full font-semibold mb-2 p-2 border-b">
            <span className="w-1/3 ">Product Name</span>
            <span className="w-1/3 text-center">Quantity</span>
            <span className="w-1/3 text-left">Price</span>
          </div>

          {/* Display each item in the checkout list */}
          {checkoutList.map(item => (
            <div key={item.productId} className="flex justify-between items-center w-full mb-2 p-2 bg-gray-50 rounded-md">
              <span className="w-1/3  text-xs sm:text-md font-medium">{item.productName}</span>
              <div className="w-1/3 flex justify-center">
                <span className="text-xs sm:text-md font-medium">{`x${item.quantity}`}</span>
              </div>
              <span className="w-1/3 text-left text-xs sm:text-md font-medium">{`${item.price * item.quantity} SAR`}</span>
            </div>
          ))}

          {/* Total section */}
          <div className="flex justify-end w-full font-semibold mt-4 p-2 border-t">
            <span className="text-right text-md font-semibold">{`Total: ${totalAmount} SAR`}</span>
          </div>

          <button
            type="button"
            className="w-full bg-primary text-white p-3 text-md rounded-md mt-4"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center">Your cart is empty. Please add items to your cart.</p>
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mt-4 text-center">
          {successMessage} Redirecting to homepage...
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
