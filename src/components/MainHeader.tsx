import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ShoppingBag } from "lucide-react";
import logoSquare from "/public/logo-square.webp";

function MainHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update login state based on token presence
  }, []);

  return (
    <header className="w-full">
      <div className="container mx-auto py-4 flex flex-col md:flex-row justify-center md:justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Link href="/">
            <div className="block w-[80px] h-[80px] bg-gray-50 p-2 rounded-full border-4 border-secondary-50 cursor-pointer mx-auto">
              <Image
                src={logoSquare}
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </Link>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold">متجر التجربة الجميلة</h1>
            <small className="text-gray-500">
              متجرك لكل تجاربك وأفكارك الجميلة
            </small>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-center">
          {/* Dynamic link based on user login status */}
          <Link href={isLoggedIn ? "/users" : "/login"}>
            <div className="w-[40px] h-[40px] rounded-full bg-secondary-50 text-primary flex items-center justify-center cursor-pointer">
              <User size={20} color="#0d1a26" />
            </div>
          </Link>
          {/* Cart icon linking to the shopping cart page */}
          <Link href="/cart">
            <div className="w-[40px] h-[40px] rounded-full bg-secondary-50 text-primary flex items-center justify-center cursor-pointer">
              <ShoppingBag size={20} color="#0d1a26" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
