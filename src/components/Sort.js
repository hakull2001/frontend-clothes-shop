import React from "react";
import styled from "styled-components";
import { BsFillGridFill, BsList } from "react-icons/bs";
import { useFilterContext } from "../context/filter_context";
import { useState, useEffect } from "react";
import axios from "axios";
const Sort = () => {
  
  const { filter_products, grid_view, setGridView, setListView, sorting, filters } =
    useFilterContext();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect( () => {
      if(filters.category === "all"){
        axios.get(decodeURI(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}`))
        .then(response => {
          setTotal(response.data.result.pagination.total);
          setProducts(response.data.result.data);
        })
        .catch(error => {
          console.log(error);
        });
      }else
       axios.get(decodeURI(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}`))
        .then(response => {
          setProducts(response.data.result.data);
          setTotal(response.data.result.pagination.total);
        })
        .catch(error => {
          console.log(error);
        });
    }, [filters]);
  return (
    <Wrapper className="sort-section">
      {/* 1st column  */}
      <div className="sorting-list--grid">
        <button
          className={grid_view ? "active sort-btn" : "sort-btn"}
          onClick={setGridView}>
          <BsFillGridFill className="icon" />
        </button>

        <button
          className={!grid_view ? "active sort-btn" : " sort-btn"}
          onClick={setListView}>
          <BsList className="icon" />
        </button>
      </div>
      {/* 2nd column  */}
      <div className="product-data">
        <p>{filters.category === "all" ? `${total} Product Available` : `${total} Product Available`} </p>
      </div>

      {/* 3rd column  */}
      <div className="sort-selection">
        <form action="#">
          <label htmlFor="sort"></label>
          <select
            name="sort"
            id="sort"
            className="sort-selection--style"
            onClick={sorting}>
            <option value="lowest">Price(lowest)</option>
            <option value="#" disabled></option>
            <option value="highest">Price(highest)</option>
            <option value="#" disabled></option>
            <option value="a-z">Price(a-z)</option>
            <option value="#" disabled></option>
            <option value="z-a">Price(z-a)</option>
          </select>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  margin-top: 5rem;

  .sorting-list--grid {
    display: flex;
    gap: 2rem;

    .sort-btn {
      padding: 0.8rem 1rem;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .icon {
      font-size: 1.6rem;
    }
    .active {
      background-color: ${({ theme }) => theme.colors.black};
      color: #fff;
    }
  }

  .sort-selection .sort-selection--style {
    padding: 0.5rem;
    cursor: pointer;

    .sort-select--option {
      padding: 0.5rem 0;
      cursor: pointer;
      height: 2rem;
      padding: 10px;
    }
  }
`;

export default Sort;
