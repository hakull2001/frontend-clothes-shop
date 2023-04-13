import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './auth/auth.reducer';

const persistAuth = {
  key: 'auth',
  storage
};

const rootReducer = combineReducers({
  auth: persistReducer(persistAuth, authReducer)
});

export default rootReducer;