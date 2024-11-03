// Sign in function to authenticate users


export async function signIn(email: string, password: string) {
  try {
    const response = await fetch("https://limitless-lake-55070.herokuapp.com/user/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.text(); // Get the error message text
      return { success: false, message: errorData || "An unknown error occurred." }; // Return the error message instead of throwing an exception
    }

    const data = await response.json(); // Now we can safely parse the data
    const sessionId = data.sessionId;

    // Check if sessionId exists
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }

    return { success: true, token: data.token };
  } catch (error: any) {
    console.error("Error during sign in:", error);
    return { success: false, message: "An error occurred during login. Please try again." };
  }
}






// Sign up function to create a new user account
export async function signUp(email: string, firstName: string, lastName: string, password: string) {
  try {
    const response = await fetch("https://limitless-lake-55070.herokuapp.com/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firstName, lastName, password }),
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text(); // Get error text
      return { success: false, message: errorText || "Error creating account" }; // Return the error message
    }

    const data = await response.json(); // Parse the JSON response
    return { success: true, token: data.token || null }; // Return success status and token
  } catch (error) {
    console.error("Error during sign up:", error);
    return { success: false, message: "An error occurred during sign up" }; // Generic error message for UI
  }
}

// Fetch all users function
export async function fetchAllUsers() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is not available");
    }

    const response = await fetch(`https://limitless-lake-55070.herokuapp.com/user/all?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text(); // Get error text
      throw new Error(errorText || "Failed to fetch users"); // Throw error to be caught below
    }

    const responseData = await response.json(); // Parse the JSON response
    return responseData; // Return parsed data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users"); // Throw error for handling in the calling function
  }
}
