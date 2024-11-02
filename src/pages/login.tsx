import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signUp } from "../services/authService";
import LoginHeader from "../components/LoginHeader";

function LoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, redirect to the homepage
      router.push("/"); // Redirect to the homepage
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLoginMode) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, firstName, lastName, password);
      }

      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        router.push("/users");
      } else {
        setError(result.message || "An unknown error occurred.");
      }
    } catch (error) {
      setError("An error occurred while attempting to log in. Please try again.");
      console.error("Login/Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center justify-center">
      <LoginHeader />

      <main className="w-full flex justify-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700">
              {isLoginMode ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>
            <p className="text-sm text-gray-500">
              {isLoginMode
                ? "قم بتسجيل الدخول لمتابعة التسوق"
                : "قم بإنشاء حساب للانضمام"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-md text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="username"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="البريد الإلكتروني.."
                required
              />
            </div>

            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-md text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="الاسم الأول.."
                    required
                  />
                </div>

                <div>
                  <label className="block text-md text-gray-700 mb-2">الاسم الأخير</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="الاسم الأخير.."
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-md text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="كلمة المرور.."
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center mt-2">{error}</p>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md text-md font-semibold"
                disabled={loading}
              >
                {loading ? "يرجى الانتظار..." : isLoginMode ? "دخول" : "إنشاء حساب"}
              </button>
            </div>
          </form>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              {isLoginMode ? (
                <>
                  ليس لديك حساب؟{" "}
                  <span
                    onClick={() => setIsLoginMode(false)}
                    className="text-primary font-semibold underline cursor-pointer"
                  >
                    إنشاء حساب جديد
                  </span>
                </>
              ) : (
                <>
                  لديك حساب بالفعل؟{" "}
                  <span
                    onClick={() => setIsLoginMode(true)}
                    className="text-primary font-semibold underline cursor-pointer"
                  >
                    تسجيل الدخول
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
