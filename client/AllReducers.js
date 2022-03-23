import { combineReducers } from "redux"
import AuthenticationReducer from './reducers/AuthenticationReducer'
import CartReducer from "./reducers/CartReducer"

const AllReducers = combineReducers({
    authen: AuthenticationReducer,
    cart: CartReducer
})


export default AllReducers