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

  useEffect(() => {
    // Retrieve token and checkout items from local storage on component load
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const storedCheckoutList = localStorage.getItem("checkoutList");
    if (storedCheckoutList) {
      setCheckoutList(JSON.parse(storedCheckoutList));
    }
  }, []);

  const handleConfirmOrder = async () => {
    if (!token) {
      setError('Token is not available. Please log in again.');
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId'); // Check for session ID
      if (!sessionId) {
        setError('Session ID is missing. Please try again.');
        return;
      }

      // Place the order and display success message if successful
      const result = await placeOrder(checkoutList, token, sessionId);
      setSuccessMessage('Order placed successfully!');

      localStorage.removeItem("checkoutList"); // Clear checkout list after order
      setCheckoutList([]);

      setTimeout(() => {
        router.push("/"); // Redirect to homepage after a short delay
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg font-bold mb-4">Confirm Your Order</h2>
      {checkoutList.length > 0 ? (
        <>
          {/* Display each item in the checkout list */}
          {checkoutList.map(item => (
            <div key={item.productId} className="flex justify-between w-full mb-2">
              <span>{item.productName}</span>
              <span>{`x${item.quantity}`}</span>
              <span>{`${item.price * item.quantity} SAR`}</span>
            </div>
          ))}
          <button
            type="button"
            className="w-full bg-primary text-white p-3 text-md rounded-md mt-4"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </>
      ) : (
        <p className="text-gray-500">Your cart is empty. Please add items to your cart.</p>
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mt-4">
          {successMessage} Redirecting to homepage...
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
