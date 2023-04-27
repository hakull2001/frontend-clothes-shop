import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
} from "@material-ui/core";
import { GlobalState } from "@app/store";
import { useSnackbar } from "notistack";
import useObservable from "@core/hooks/use-observable.hook";
import { useStyles } from "./make-style";
import PopupDialog from "../popup-dialog";
import { ProductRate, ProductRateDto, UpdateProductRateDto } from "@app/models/product-rate.model";
import {  TYPE_ALERT } from "@app/shared/constants/common";
import ProductRateService from "@app/services/http/product.rate.serive";
import useForceUpdate from "@core/hooks/use-force-update.hook";
import { ResponseResult } from "@core/services/http/http.service";
import { Col, ListGroup, Row } from "react-bootstrap";
import Rating from '@mui/material/Rating';
import RatingR from "../rating";

  const ProductRateComponent = (props)=> {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();
  
    const [forceUpdate, setForceUpdate] = useForceUpdate();
    const { subscribeOnce, subscribeUntilDestroy } = useObservable();
  
  
    const [total, setTotal] = useState(0);
    const [productRates, setproductRates] = useState<ProductRate[]>([]);
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [recordForAction, setRecordForAction] = useState<any>(
      new ProductRate(null)
    );
    const [productRate, setProductRate] = useState<ProductRate>();

    useEffect(() => {
        if(props.id !== undefined)
        subscribeOnce(
          ProductRateService.getList(props?.id),
          (response: ResponseResult) => {
            setproductRates(response.data as ProductRate[]);
            setTotal(response.pagination?.total || 0);
          }
        );
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [productRate, props.id]);
      
      const [rating, setRating] = React.useState<number | null>(0);
      const [comment, setComment] = useState('')
      const submitHandler = () => {
          subscribeUntilDestroy(ProductRateService.createReview({
            productId : props?.id,
            value : rating !== null ? rating : 1,
            comment : comment,
          }),(data)=>{
              setProductRate(data);
              if(data){
                enqueueSnackbar("Đánh giá thành công", {
                  variant: TYPE_ALERT.SUCCESS,
                });
                setComment("")
                setRating(0);
              }
          })
          
      }
      return (
        <Container maxWidth="xl" className={classes.container}>
        <Box style={{ display: "flex", justifyContent:'center' }}>
         <Row>
          <Col>
            <h2>Đánh giá ({total})</h2>
            {productRates.length === 0 && <h1>Sản phẩm này chưa có đánh giá</h1>}
          <div style={{ height: '200px', width:'930px', overflowY: 'scroll' }}>
          <ListGroup variant='flush'>
                 {productRates?.map((review) => (
                  <Paper>
                     <ListGroup.Item key={review.id}>
                    <Box>
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                      <strong style={{marginRight:5}}>{`${review.user.firstName} ${review.user.lastName}:`}</strong>
                      <p>{review.comment}</p>

                      </div>
                     <RatingR value={review.value} text="" />
                     <p>{review.createdAt}</p>
                    </Box>
                   </ListGroup.Item>
                  </Paper>
                 ))}

              </ListGroup>
          </div>
                  <Paper style={{marginTop:30, padding:10}}>
                  <div>
                       <label htmlFor="rating">Xếp hạng</label>
                       <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}/>
                     </div>
                       <div>
                       <TextField
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       variant="outlined"
                       margin="normal"
                       required
                       fullWidth
                       label="Bình luận"
                       name="username"
                       autoComplete="email"
                        id="comment"
                       />
                     </div>
                    
                       <Button type="submit" color="primary" onClick={submitHandler} style={{backgroundColor:'black', color:'white'}}>Đánh giá</Button>
                  </Paper>
                     

          </Col>
        </Row>
        </Box>
      </Container>
      );
  }
  
  const selectAuth = (state: GlobalState) => state.auth;
  
  export default ProductRateComponent;