import React, { useState } from "react";
import FormatPrice from "../Helpers/FormatPrice";
import CartAmountToggle from "./CartAmountToggle";
import { FaTrash } from "react-icons/fa";
import { useCartContext } from "../context/cart_context";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
const CartItem = (props) => {
  const [quantity, setQuantity] = useState(props.quantity);
  const handleIncrease = () => {
    setQuantity(quantity + 1);
    props.handles(quantity+1, props.id)
    // window.location.reload();
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    props.handles(quantity > 1 ? quantity-1 : quantity, props.id);
    // window.location.reload();
  };

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/order-items/${itemId}`, config);
      window.location.reload();
    }
     catch (error) {
      console.error(error);
    }
  };

  // useEffect(()=>{
  //   removeItemFromCart();
  // }, []);
  // console.log(removeItem);
  // const setDecrease = () => {
  //   amount > 1 ? setAmounts(amount - 1) : setAmounts(1);
  // };

  // const setIncrease = () => {
  //   amount < stock ? setAmounts(amount + 1) : setAmounts(stock);
  // };
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  const [subTotal, setSubtotal] = useState(0);
  const handleCheckBox = () => {
    if(isChecked === false){
        setSubtotal(subTotal + props.product.price * quantity);
    }else{
      setSubtotal(subTotal - props.product.price * quantity);
    }
    props.callBack(isChecked, subTotal, props.product.price * quantity);
  }
  useEffect(()=>{
    handleCheckBox();
  }, [isChecked])
  return (
    <div className="cart_heading grid grid-five-column">
         <div className="topping">
        <input
          type="checkbox"
          id="topping"
          name="topping"
          value="Paneer"
          checked={isChecked}
          onChange={handleOnChange}
          checkBox = {handleCheckBox}
        />
      </div>
      <div className="cart-image--name">
        <div>
          <figure>
            <img src={props.product.productImages[0].imageUrl} alt={props.product.id} />
          </figure>
        </div>
        <div>
         <Link to={`/singleproduct/${props.product.id}`}> <p>{props.product.name}</p></Link>
          <div className="color-div">
            <p>color:</p>
            <div
              className="color-style"
              style={{ backgroundColor: props.color, color: props.color }}></div>
          </div>
        </div>
      </div>
      {/* price   */}
      <div className="cart-hide">
        <p>
          <FormatPrice price={props.product.price} />
        </p>
      </div>

      {/* Quantity  */}
      <CartAmountToggle
        amount={quantity}
        setDecrease={() => handleDecrease(props.product.id)}
        setIncrease={() => handleIncrease(props.product.id)}
      />

      {/* //Subtotal */}
      <div className="cart-hide">
        <p>
          <FormatPrice price={props.product.price * quantity} />
        </p>
      </div>

      <div>
        <FaTrash className="remove_icon" onClick={() => removeItemFromCart(props.id)} />
      </div>
    </div>
  );
};

export default CartItem;