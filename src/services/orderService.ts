import { CheckoutItemDto } from '../types/Product';

export const createCheckoutSession = async (checkoutItemDtoList: CheckoutItemDto[], token: string): Promise<any> => {
  const response = await fetch("https://limitless-lake-55070.herokuapp.com/order/create-checkout-session", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(checkoutItemDtoList)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create checkout session');
  }

  return await response.json(); // Return the response after converting to JSON
};

export const placeOrder = async (
  checkoutItemDtoList: CheckoutItemDto[],
  token: string,
  sessionId: string
): Promise<any> => {
  const response = await fetch(
    `https://limitless-lake-55070.herokuapp.com/order/add?sessionId=${sessionId}&token=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutItemDtoList), // Send the list of checkout items in the request body
    }
  );

  if (!response.ok) {
    const errorText = await response.text(); // Retrieve error text from the response
    console.error("Error details:", errorText); // Log the error to the console
    throw new Error(errorText || 'There was an error sending the order data. Please try again.'); // Throw the actual or a default error message
  }

  return await response.json(); // Return the response after converting to JSON
};
