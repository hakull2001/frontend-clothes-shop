import styled from "styled-components";
import FilterSection from "./components/FilterSection";
import ProductList from "./components/ProductList";
import Sort from "./components/Sort";
import { useFilterContext } from "./context/filter_context";
import { useEffect, useState, u } from "react";
import { Pagination } from "@mui/material";
import axios from "axios";
const Products = () => {
  const {filters} = useFilterContext();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState();
  const handlePagination =  (page) => {
      console.log(page);
  }
  const getProducts = async (url) => {
    try {
      const res = await axios.get(url);
      const productList = await res.data.result.data;
      const paginationList = await res.data.result.pagination;
      setPagination(paginationList);
      setProducts(productList)
    } catch (error) {
        console.log(error);
    }
  };
  console.log(pagination);
  useEffect(() => {
    if(filters.category === "all")
      getProducts(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}`);
    else
      getProducts(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}`);
  }, [filters]);
  
  return (
    <Wrapper>
      <div className="container grid grid-filter-column">
        <div>
          <FilterSection />
        </div>

        <section className="product-view--sort">
          <div className="sort-filter">
            <Sort />
          </div>
          <div className="main-product">
            <ProductList list = {products} pagination = {pagination}/>
          </div>
        </section>

      </div>

    </Wrapper>
  );
};

const Wrapper = styled.section`
  .grid-filter-column {
    grid-template-columns: 0.2fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .grid-filter-column {
      grid-template-columns: 1fr;
    }
  }
`;

export default Products;
