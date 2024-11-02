import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchAllUsers } from "../services/authService";
import LoginHeader from "../components/LoginHeader";

function UsersPage() {
  // State to hold users data, loading status, and error messages
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch users data if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, set error and redirect to login
      setError("Please log in to view users.");
      router.push("/login");
    } else {
      // Fetch users data
      fetchAllUsers()
        .then((data) => {
          setUsers(data); // Update users state
          setError(null); // Clear any previous error
        })
        .catch((error) =>
          setError(error.message || "An error occurred while fetching data.")
        )
        .finally(() => setLoading(false)); // Set loading to false
    }
  }, []);

  // Display loading message if data is still being fetched
  if (loading) {
    return <p className="text-center">Loading data...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header component */}
      <LoginHeader />

      {/* Page title */}
      <h1 className="text-2xl font-bold flex items-center justify-center mb-4">User List</h1>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Responsive table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left w-1/5">Role</th>
              <th className="py-2 px-4 border-b text-left w-2/5">Email</th>
              <th className="py-2 px-4 border-b text-left w-1/5">Last Name</th>
              <th className="py-2 px-4 border-b text-left w-1/5">First Name</th>
              <th className="py-2 px-4 border-b text-left w-1/12">ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user:User ) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b text-center">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
