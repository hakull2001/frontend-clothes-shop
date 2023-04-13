import React from "react";
import { NavLink } from "react-router-dom";
import FormatPrice from "../Helpers/FormatPrice";
import axios from "axios";
import { useEffect, useState } from 'react';
const Product = (product) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
      axios.get(`http://localhost:8080/api/v1/categories`)
      .then(response => {
        setCategories(response.data.result);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  let categoryName = "";
  if(categories.length !== 0)
  categories.forEach(category => {
      if(category.id === product.category.id)
        {
          categoryName = category.name;
          return;
        }
    })
  return (
    <NavLink to={`/singleproduct/${product.id}`}>
      <div className="card">
        <figure>
          <img src={product.productImages[0].imageUrl} alt={product.name} />
          <figcaption className="caption">{categoryName}</figcaption>
        </figure>

        <div className="card-data">
          <div className="card-data-flex">
            <h3>{product.name}</h3>
            <p className="card-data--price">{<FormatPrice price={product.price} />}</p>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Product;
