import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

function Products() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const getProducts = async (search = "", category = "") => {
try {
setLoading(true);
setError("");


  const response = await axios.get(
    "http://localhost:5000/products",
    {
      params: {
        search,
        category,
      },
    }
  );

  setProducts(response.data.products || []);
} catch (error) {
  setError("Failed to load products");
} finally {
  setLoading(false);
}


};

useEffect(() => {
getProducts();
}, []);

const handleSearch = (search, category) => {
getProducts(search, category);
};

return (
<> <Navbar />


  <div className="products-page">
    <h1>ShopKart Products</h1>

    <SearchBar onSearch={handleSearch} />

    {loading && <h2>Loading products...</h2>}

    {error && <h2>{error}</h2>}

    {!loading && !error && products.length === 0 && (
      <h2>No products found</h2>
    )}

    {!loading && !error && products.length > 0 && (
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    )}
  </div>
</>


);
}

export default Products;
