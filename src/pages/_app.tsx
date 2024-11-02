

// src/pages/_app.tsx
import React from "react";
import Footer from "../components/Footer";
import type { AppProps } from "next/app";
import "./global.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex bg-gray-50 flex-col min-h-screen">

      {/* Main content area */}
      <main className="flex-grow container mx-auto p-4">
        <Component {...pageProps} />
         <ToastContainer position="top-right" autoClose={3000} />
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default App;

