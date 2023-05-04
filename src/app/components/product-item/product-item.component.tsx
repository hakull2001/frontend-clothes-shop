import { Link, NavLink } from "react-router-dom";
import { Product } from "@app/models/product.model";
import { imageNotFound } from "@app/shared/constants/common";
import "./product-item.style.scss";
import useObservable from "@core/hooks/use-observable.hook";
import ViewService from "@app/services/view.service";
import { Rating } from "@material-ui/lab";
import { useEffect, useState } from "react";
import ProductRateService from "@app/services/http/product.rate.serive";
import { ProductRate } from "@app/models/product-rate.model";
import RatingR from "../rating";

type PropTypes = {
  item: Product;
};

function ProductItem(props: PropTypes) {
  const { item } = props;
  const { subscribeOnce } = useObservable();
  const baseUrl = new URL("http://localhost:8080/api" || "");

  let srcImage = imageNotFound;
  if (item.productImages[0]) {
    srcImage = item.productImages[0]?.imageUrl.startsWith("http")
      ? item.productImages[0]?.imageUrl
      : `${baseUrl.origin}${item.productImages[0].imageUrl}`;
  }
  const [productRates, setproductRates] = useState<ProductRate[]>([]);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(0);
  useEffect(()=>{
    subscribeOnce(ProductRateService.getList(item.id), (data)=>{
      setRate(data.data.reduce((tot, current)=>{
        return tot + current.value;
      }, 0));
      setproductRates(data.data);
      setTotal(data.pagination.total);
    })
  }, [item])
  console.log(rate/total);
  
  

  const onProductItemClick = () => {
    ViewService.addLastView(item.id);
  };
  

  return (
    <>
      <Link
        to={`/products/${item.slug}`}
        style={{ textDecoration: "none", color: "black" }}
        onClick={onProductItemClick}
      >
        <div
          className="col-xl-3 col-lg-3 col-md-3 bcontent"
          style={{ padding: "0 1em", minHeight: "100%",
          marginLeft : 10,
        border: "2px solid black" }}
        >
          <div>
            <span>
              <img src={srcImage} alt={item.title} />
            </span>
          </div>
          <div className="btitle">
            <div className="name">
              <span>{item.title}</span>
              <div className="creator">{item.author}</div>
              {/* <Rating value={Math.floor(Math.random() * 5) + 1} style={{color : 'orange'}}></Rating> */}
              <RatingR value={rate/total} text={""}></RatingR>
              <div className="price">
                <div>{item.price.toLocaleString("en")} đ</div>
                <div className="buy">
                  <i className="fas fa-shopping-bag buy-icon"></i>
                  {/* <i className="fas fa-heart buy-icon"></i> */}
                </div>
              </div>
            </div>
          </div>
        </div>

      </Link>
    </>
  );
}

export default ProductItem;
