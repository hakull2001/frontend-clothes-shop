import AuthServices from './auth.service';
import AuthActionsEnum from '../../constants/actionsEnum';


export const authLoadingAction = () => ({
  type: AuthActionsEnum.LOADING
});

export const authStopLoadingAction = () => ({
  type: AuthActionsEnum.STOP_LOADING
});

export const authSubmittingAction = () => ({
  type: AuthActionsEnum.SUBMITTING
});

export const authStopSubmittingAction = () => ({
  type: AuthActionsEnum.STOP_SUBMITTING
});

export const authFailedAction = (error) => ({
  type: AuthActionsEnum.FAILED,
  payload: { error }
});

export const authSetDataAction = (data) => ({
  type: AuthActionsEnum.SET_DATA,
  payload: { data }
});

export const authSetAccessToken = (token) => ({
  type: AuthActionsEnum.SET_TOKEN,
  payload: { token }
});

export const authLogout = () => ({
  type: AuthActionsEnum.LOGOUT
});

export const resetError = () => ({
  type: AuthActionsEnum.RESET_ERROR
});

export const authForgetPasswordAsyncAction = (email, navigate) => async (dispatch) =>{
  try {
    dispatch(authLoadingAction());
    const res = await AuthServices.forgetPassword(email);
    dispatch(authSetDataAction(res));
    console.log(res);
    navigate('/auth/profile');
  } catch (error) {
    console.log(error);
      dispatch(authFailedAction(error));
  } finally {
      dispatch(authStopLoadingAction());
  }
}
export const authSignInAsyncAction =
  (username, password, navigate) => async (dispatch) => {
    try {
      dispatch(authLoadingAction());
      const res = await AuthServices.signIn(username, password);
      dispatch(authSetDataAction(res.data.result.data));
      console.log(res.data.result.data);
      localStorage.setItem("token", res.data.result.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data.result.data.user));
      window.location.assign("http://localhost:3000");
      navigate('/');
    } catch (error) {
        dispatch(authFailedAction("Incorrect username or password"));
    } finally {
        dispatch(authStopLoadingAction());
    }
  };

  export const authRegisteredAction =
  (email, username, firstName, lastName, address, phoneNumber, password, setEmail, callback, navigate) => async (dispatch) =>{
    try{
      dispatch(authLoadingAction());
      await AuthServices.register(email, username, firstName,  lastName,  address, phoneNumber, password);
      navigate('/login');
      setEmail(email);
      callback();
    }catch (error) {
      dispatch(authFailedAction(error));
    } finally {
      dispatch(authStopLoadingAction());
    }
  }

  export const authGetProfileAsyncAction = () => async (dispatch) => {
    try {
      dispatch(authLoadingAction());
  
      const res = await AuthServices.getProfile();
      dispatch(authSetDataAction({ account: { ...res.data.result.data } }));
    } catch (error) {
      dispatch(authFailedAction(error.msg));
    } finally {
      dispatch(authStopLoadingAction());
    }
  };

  export const authGetCartAsyncAction = () => async (dispatch) =>{
    try {
      dispatch(authLoadingAction());
  
      const res = await AuthServices.getOrderItemOfCart();
      console.log(res);
      dispatch(authSetDataAction({ carts: { ...res.data.result.data } }));
    } catch (error) {
      dispatch(authFailedAction(error.msg));
    } finally {
      dispatch(authStopLoadingAction());
    }
  }
  
  export const authUpdateProfileAsyncAction = (values) => async (dispatch) => {
    try {
      dispatch(authSubmittingAction());
      await AuthServices.updateProfile(values, values.id);
      dispatch(authSetDataAction({ account: { ...values } }));
    } catch (error) {
      dispatch(authFailedAction(error.msg));
    } finally {
      dispatch(authStopSubmittingAction());
    }
  };

  export const authUpdateAvatarAsyncAction = (fileImage, values) => async (dispatch) =>{
    try{
      dispatch(authSubmittingAction());
      await AuthServices.uploadAvatar(fileImage, values.id);
      dispatch(authSetDataAction({ account: { ...values } }));

    }catch (error) {
      dispatch(authFailedAction(error));
    } finally {
      dispatch(authStopSubmittingAction());
    }
  };

