import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductDetails() {
const { id } = useParams();

const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const getProduct = async () => {
try {
const response = await axios.get(
`https://shopkart-ce9s.onrender.com/products/${id}`
);


    setProduct(response.data.product);
  } catch (error) {
    setError("Product not found");
  } finally {
    setLoading(false);
  }
};

getProduct();


}, [id]);

if (loading) {
return <h2>Loading product...</h2>;
}

if (error || !product) {
return <h2>{error || "Product not found"}</h2>;
}

return (
<> <Navbar />


  <div className="product-details-page">
    <img
      src={product.image}
      alt={product.name}
      className="product-details-image"
    />

    <div className="product-details-content">
      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <h2>₹{product.price}</h2>

      <p>Category: {product.category}</p>

      <p>
        {product.stock > 0
          ? `${product.stock} available`
          : "Out of stock"}
      </p>
    </div>
  </div>
</>


);
}

export default ProductDetails;
