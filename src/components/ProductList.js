import React, { useEffect, useState } from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const ProductList = (props) => {
  const { all_products, grid_view, filters, filter_products } = useFilterContext();
  const [products, setProducts] = useState([]);
  const getProducts = async (url) => {
    try {
      const res = await axios.get(url);
      const productList = await res.data.result.data;
      setProducts(productList)
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if(grid_view === true)
    {
      if(filters.category === "all")
      getProducts(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${props.pagination !== undefined ? props.pagination.page :1 }&perPage=${6}`);
    else
      getProducts(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${props.pagination !== undefined ? props.pagination.page :1 }&perPage=${6}`);
    }
    else if(grid_view === false){
      if(filters.category === "all")
      getProducts(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${props.pagination !== undefined ? props.pagination.page :1 }&perPage=${3}`);
    else
      getProducts(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${props.pagination !== undefined ? props.pagination.page :1 }&perPage=${3}`);
    }

  }, [filters]);
  
    if (grid_view === true) {
      return<>
         <GridView products={products} />;
         <Stack spacing={2}>
        </Stack>
        <div style={{display : "flex",
      justifyContent:"center",
      marginTop: "-100px",
      padding:"50px"}}>
    <Pagination count={props.pagination !== undefined ? props.pagination.lastPage : 3} variant="outlined"  shape="rounded" />    

    </div>
      </>}
 else 
    return <>
      <ListView products={products} />
      <div style={{display : "flex",
      justifyContent:"center",
      marginTop: "-100px",
      padding:"50px"}}>
    <Pagination count={props.pagination !== undefined ? props.pagination.lastPage : 3} variant="outlined"  shape="rounded" />    

    </div>
    </>;
  
};

export default ProductList;
