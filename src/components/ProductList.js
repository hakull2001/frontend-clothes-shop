import React, { useEffect, useState } from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import usePagination from "./Pagination";

const ProductList = (props) => {
  let [page, setPage] = useState(1);

  const { all_products, grid_view, filters, filter_products } = useFilterContext();
  const [pagination, setPagination] = useState();
  const [products, setProducts] = useState([]);
  const getProducts = async (url) => {
    try {
      const res = await axios.get(url);
      const productList = await res.data.result.data;
      setProducts(productList)
      setPagination(await res.data.result.pagination.lastPage);
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if(grid_view === true)
    {
      if(filters.category === "all")
      getProducts(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${page}&perPage=${6}`);
    else
      getProducts(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${page }&perPage=${6}`);
    }
    else if(grid_view === false){
      if(filters.category === "all")
      getProducts(`http://localhost:8080/api/v1/products?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${page }&perPage=${3}`);
    else
      getProducts(`http://localhost:8080/api/v1/products/${filters.category}?name=${filters.text}&fromPrice=${filters.minPrice}&toPrice=${filters.price}&page=${page}&perPage=${3}`);
    }

  }, [filters, page]);
  const _DATA = usePagination(products, 6);
  const handleChange = (e, p) => {
    setPage(p);
    console.log(p, e);
    _DATA.jump(p);
  };
  console.log(pagination);
    if (grid_view === true) {
      return<>
         <GridView products={products} />;
         <Stack spacing={2}>
        </Stack>
        <div style={{display : "flex",
      justifyContent:"center",
      marginTop: "-100px",
      padding:"50px"}}>
<Pagination
        count={pagination}
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </div>
      </>}
 else 
    return <>
      <ListView products={products} />
      <div style={{display : "flex",
      justifyContent:"center",
      marginTop: "-100px",
      padding:"50px"}}>
 <Pagination
        count={pagination}
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </div>
    </>;
  
};

export default ProductList;
