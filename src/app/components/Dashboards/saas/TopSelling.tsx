import { Box, Card, Rating } from "@mui/material";
import FlexBox from "../../flexbox";
import { H5, Small } from "../../typography/typography";
import { FC, useState, useEffect } from "react";
import useObservable from "@core/hooks/use-observable.hook";
import { Product } from "@app/models/product.model";
import ProductService from "@app/services/http/product.service";
import { ProductRate } from "@app/models/product-rate.model";
import ProductRateService from "@app/services/http/product.rate.serive";
import { buildImageSrc } from "@app/shared/helpers/helpers";
import { imageNotFound } from "@app/shared/constants/common";
import { NavLink } from "react-router-dom";

const TopSelling: FC = () => {
  const {subscribeOnce} = useObservable();
 const [products, setProducts] =useState<Product[]>([]);
 useEffect(()=>{
  subscribeOnce(ProductService.getListSellProducts(), (data)=>{
    console.log(data);
    
    setProducts(data as unknown as Product[]);
  })
 }, [])
 let count = 1;
 
  return (
    <Card sx={{ padding: "2rem", height: "100%" }}>
      <H5>Top sản phẩm bán chạy</H5>

      {products.length !== 0 && products.map((product) => (
        <NavLink to={`/products/${product.slug}`} key={product.id} style={{listStyle : 'none', textDecoration:'none', color : 'black', display:'flex', justifyContent:'space-between',
        alignItems : 'center'}}>
          <FlexBox key={product.id} mt="1.2rem">
          <img src={  !!product.productImages.length
                ? buildImageSrc(product.productImages[0].imageUrl)
                : imageNotFound } alt="Men Keds" width="90px" />

          <Box display="flex" flexDirection="column" ml="1rem">
            <Small>{product.title}</Small>
            {/* <Rating
              name="read-only"
              size="small"
              defaultValue={product.}
              readOnly
              sx={{ my: "3px" }}
            /> */}
            <Small fontWeight={600}>{`${product.price.toLocaleString("vn")}đ`}</Small>
          </Box>
        </FlexBox>
        <h1>{count++}</h1>
        </NavLink>
      ))}
    </Card>
  );
};

const productList = [
  {
    title: "Nike airmax 170",
    image: "/static/products/black-keds.png",
    price: 567,
    rating: 5,
  },
  {
    title: "Nike airmax 170",
    image: "/static/products/green-keds.png",
    price: 200,
    rating: 5,
  },
  {
    title: "Nike airmax 170",
    image: "/static/products/yellow-keds.png",
    price: 400,
    rating: 5,
  },
];

export default TopSelling;
