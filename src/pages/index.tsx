// src/pages/index.tsx
import React from "react";
import MainSlider from "../components/MainSlider";
import ProductGrid from "../components/ProductGrid";
import MainHeader from "../components/MainHeader";

function Home() {
  return (
    <div className="bg-gray-50 ">
      <MainHeader/>
      <main className="container mx-auto bg-white rounded-lg shadow-md p-4 my-8">
        <div className="p-2 sm:p-4">
          و
          {/* Slider */}
          <MainSlider />
          {/* Product Grid */}
          <ProductGrid/>
        </div>
      </main>
    </div>
  );
}

export default Home;
