import AuthActionsEnum from '../../constants/actionsEnum';

const initialState = {
  isLoading: false,
  error: '',
  data : {
    jwt :'',
    user:'',
  }
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AuthActionsEnum.LOADING:
      return {
        ...state,
        isLoading: true
      };

    case AuthActionsEnum.STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };

    case AuthActionsEnum.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...payload.data },
        error: ''
      };
      case AuthActionsEnum.FAILED: {
        return {
          ...state,
          ...payload
        };
      }
      case AuthActionsEnum.SET_JWT: {
        return {
          ...state,
          data: { ...state.data, ...payload }
        };
      }
      case AuthActionsEnum.LOGOUT: {
        return {
          ...state,
          ...initialState
        };
      }
      case AuthActionsEnum.RESET_ERROR: {
        return {
          ...state,
          error: ''
        };
      }
    default:
      return state;
  }
};

export default authReducer;