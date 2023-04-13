import endpoints from '../constants/endpoints';
import axiosClient from ".././utils/axios";
import FormData from 'form-data';

const AuthServices = {};

AuthServices.signIn = (username, password) =>
  new Promise((resl, rej) => {
    axiosClient
      .post(endpoints.authLogin, { username, password })
      .then((res) => resl(res))
      .catch((e) => rej(e));
  });


AuthServices.existsByEmail = (email)=>
  axiosClient
    .get(`${endpoints.checkEmail}${email}`)
;

AuthServices.existsByUsername = (username)=>
  axiosClient
    .get(`${endpoints.checkUsername}${username}`)
;

AuthServices.register = (email, username, firstName, lastName, address, phoneNumber, password) =>
  new Promise((resl, rej) => {
    axiosClient
      .post(endpoints.authRegister, {email, username, firstName, lastName, address, phoneNumber, password})
      .then((res) => resl(res))
      .catch((e) => rej(e));
  });


AuthServices.forgetPassword = (email) =>
  new Promise((resl, rej) => {
    axiosClient
      .post(endpoints.forgetPassword, {email})
      .then((res) => resl(res))
      .catch((e) => rej(e))
  });


AuthServices.resetPassword = (token, newPassword)=>
    new Promise((resl, rej) => {
      axiosClient
        .post(endpoints.resetPassword, {params : {token, newPassword}})
    });

AuthServices.getProfile = () =>
    new Promise((resl, rej) => {
      axiosClient
        .get(endpoints.getProfile)
        .then((res) => resl(res))
        .catch((e) => rej(e));
    });

AuthServices.updateProfile = (formValues, accountId) =>
  new Promise((resl, rej) => {
    axiosClient
      .put(`${endpoints.updateProfile}/${accountId}`, formValues)
      .then((res) => resl(res))
      .catch((e) => rej(e));
  });

AuthServices.uploadAvatar = (imageFile, accountId) => 
  new Promise((resl, rej) => {
    const body = new FormData();
    body.append("image", imageFile);
    axiosClient
      .post(`${endpoints.uploadAvatar}/${accountId}`, body)
      .then((res) => resl(res))
      .catch((e) => rej(e));
  });

AuthServices.updateQuantity = (orderItemId, quantity) => 
new Promise((resl, rej) => {
  axiosClient
    .put(`${endpoints.updateQuantity}/${orderItemId}`, {
      body : quantity
    })
    .then((res) => resl(res))
    .catch((e) => rej(e));
});

AuthServices.getOrderItemOfCart = () =>{
  new Promise((resl, rej) => {
    axiosClient
      .get(endpoints.getCart)
      .then((res) => resl(res))
      .catch((e) => rej(e));
  });
}
export default AuthServices;