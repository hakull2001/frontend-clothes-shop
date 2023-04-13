import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/cartReducer";
import axios from "axios";
import React from "react";
const CartContext = createContext();
const token = localStorage.getItem("token");
const headers = { 'Authorization': `Bearer ${token}` };
const initialState = {
  cart: [],
  total_item: "",
  total_price: "",
  shipping_fee: 50000,
};


const GetLocalCartData = async () => {
  await axios.get('http://localhost:8080/api/v1/carts', { headers })
      .then(response => initialState.cart.push(response.data.result.data.orderItems));
    return;
    };

const CartProvider = ({ children }) => {
  GetLocalCartData();
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const addToCart = (id, color, amount, product) => {
    dispatch({ type: "ADD_TO_CART", payload: { id, color, amount, product } });
  };

  // increment and decrement the product

  const setDecrease = (id) => {
    dispatch({ type: "SET_DECREMENT", payload: id });
  };

  const setIncrement = (id) => {
    dispatch({ type: "SET_INCREMENT", payload: id });
  };

  // to remove the individual item from cart
  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  // to clear the cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // to add the data in localStorage
  // get vs set

   useEffect(() => {
    // dispatch({ type: "CART_TOTAL_ITEM" });
    // dispatch({ type: "CART_TOTAL_PRICE" });
    dispatch({ type: "CART_ITEM_PRICE_TOTAL" });

    localStorage.setItem("dataCarts", JSON.stringify(state.cart[0]));
  }, [state.cart[0]]);
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeItem,
        clearCart,
        setDecrease,
        setIncrement,
      }}>
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };
