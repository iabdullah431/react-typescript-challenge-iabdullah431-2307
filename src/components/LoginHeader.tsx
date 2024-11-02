import React from "react";
import Image from "next/image";
import logoSquare from "/public/logo-square.webp";
import Link from "next/link";

function LoginHeader() {
  return (
    <header className="w-full flex flex-col items-center justify-center mt-6 mb-4">
          <Link href="/">
            <div className="block w-[80px] h-[80px] bg-gray-50 p-2 rounded-full border-4 border-secondary-50 cursor-pointer">
              <Image
                src={logoSquare}
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </Link>
      <h1 className="text-2xl font-bold text-primary mt-2">
        متجر التجربة الجميلة
      </h1>
      <small className="text-gray-500 text-sm">
        متجرك لكل تجاربك وأفكارك الجميلة
      </small>
    </header>
  );
}

export default LoginHeader;
