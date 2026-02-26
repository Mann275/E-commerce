import React from "react";

function Products() {
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap ">
        <FilterSidebar />
        <div>
          <div>
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
