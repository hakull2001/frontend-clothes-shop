import { useState } from "react";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa";
import CartAmountToggle from "./CartAmountToggle";
import { NavLink } from "react-router-dom";
import { Button } from "../styles/Button";
import { useCartContext } from "../context/cart_context";
import axios from 'axios';
import { useEffect } from "react";
import RequireAuth from "./RequireAuth";
const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const AddToCart =  ({ product }) => {

  

  const { id, color, sold } = product;
  const listColor = ['red', 'green', 'blue']
  const [colors, setColors] = useState(listColor[0]);
  const [amount, setAmount] = useState(1);

  const setDecrease = () => {
    amount > 1 ? setAmount(amount - 1) : setAmount(1);
  };

  const setIncrease = () => {
    amount < sold ? setAmount(amount + 1) : setAmount(sold);
  };

  const handleSubmit = async (productId, quantity) => {
   
    try {
      await axios.post('http://localhost:8080/api/v1/carts', {productId, quantity, color : colors}, config);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=>{
    handleSubmit();
  }, []);

  return (
    <Wrapper>
      <div className="colors">
        <p>
          Color:
          {listColor.map((curColor, index) => {
            return (
              <button
                key={index}
                style={{ backgroundColor: curColor }}
                className={colors === curColor ? "btnStyle active" : "btnStyle"}
                onClick={() => setColors(curColor)}>
                {colors === curColor ? <FaCheck className="checkStyle" /> : null}
              </button>
            );
          })}
        </p>
      </div>
      {/* add to cart  */}
      <CartAmountToggle
        amount={amount}
        setDecrease={setDecrease}
        setIncrease={setIncrease}
      />
    {
      !token &&   <NavLink to="/login">
      <Button className="btn">Add To Cart</Button>
    </NavLink>
    }
      <NavLink  onClick={() => handleSubmit(id, amount) && window.location.assign("http://localhost:3000/cart")}>
        <Button className="btn">Add To Cart</Button>
      </NavLink>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .colors p {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .btnStyle {
    width: 2rem;
    height: 2rem;
    background-color: #000;
    border-radius: 50%;
    margin-left: 1rem;
    border: none;
    outline: none;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  .active {
    opacity: 1;
  }

  .checkStyle {
    font-size: 1rem;
    color: #fff;
  }

  /* we can use it as a global one too  */
  .amount-toggle {
    margin-top: 3rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 1.4rem;

    button {
      border: none;
      background-color: #fff;
      cursor: pointer;
    }

    .amount-style {
      font-size: 2.4rem;
      color: ${({ theme }) => theme.colors.btn};
    }
  }
`;
export default AddToCart;
