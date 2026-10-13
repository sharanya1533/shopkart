import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [cartActionLoading, setCartActionLoading] = useState({});

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      setCartError("");

      const response = await axios.get(
        "http://localhost:5000/cart",
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setCartItems([]);
      } else {
        setCartError(
          error.response?.data?.message ||
            "Failed to load cart"
        );
      }
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: true,
      }));

      setCartError("");

      const response = await axios.post(
        `http://localhost:5000/cart/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart || []);

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to add product to cart";

      return {
        success: false,
        message,
      };
    } finally {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: false,
      }));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: true,
      }));

      setCartError("");

      const response = await axios.patch(
        `http://localhost:5000/cart/${productId}`,
        {
          quantity,
        },
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart || []);

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update quantity";

      return {
        success: false,
        message,
      };
    } finally {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: false,
      }));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: true,
      }));

      setCartError("");

      const response = await axios.delete(
        `http://localhost:5000/cart/${productId}`,
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart || []);

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to remove product";

      return {
        success: false,
        message,
      };
    } finally {
      setCartActionLoading((current) => ({
        ...current,
        [productId]: false,
      }));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        cartActionLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};

export default CartProvider;