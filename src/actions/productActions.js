import axios from 'axios'
 import {
   PRODUCT_LIST_REQUEST,
   PRODUCT_LIST_SUCCESS,
   PRODUCT_LIST_FAIL,
   PRODUCT_DETAILS_REQUEST,
   PRODUCT_DETAILS_SUCCESS,
   PRODUCT_DETAILS_FAIL,
   PRODUCT_CREATE_REVIEW_REQUEST,
   PRODUCT_CREATE_REVIEW_SUCCESS,
   PRODUCT_CREATE_REVIEW_FAIL,
 } from '../constants/productConstants'


export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
    })

    const app_access_token = localStorage.getItem("app_access_token");
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${app_access_token.length !== 0 ? app_access_token : ""}`,
      },
    }

    await axios.post(`http://localhost:8080/api/product-rates`, review, config)

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}