const initialState = {
    cart: []
}


const CartReducer = (state = initialState, action) => {
    if (action.type === "ADD_TO_CART") {

        let updateCart = []



        console.log("Id : ", action.payload.id)
        console.log("Payload : ", action.payload)

        let foundItem = state.cart.filter((item)=> item.id == action.payload.id) //find where is product be like new product that we add {id : 1, name: 'water'}

        // console.log("Found Item : ", foundItem)

        if(!foundItem || foundItem.length <= 0){ // if({id: 1, name: 'water'}.length > 0) true
            updateCart = [...state.cart, action.payload]
        }else{
            updateCart = state.cart.map((item)=>{ // find in cart where is {id: 1, name: 'water'} if meet add property {id: 1, name: 'water', quantity: 1}
                return{
                    ...item,
                    quantity: item.id === action.payload.id ? item.quantity + 1 : item.quantity
                }
            })
        }

        return{
            cart: updateCart
        }

    }else if(action.type === "REMOVE_PRODUCT"){
        let remove = state.cart.filter((item)=> {
            return item.id !== action.payload
        })

        return{
            cart: remove
        }

    }else if(action.type === "INCREMENT"){
        console.log(action.payload)
        let updateCart = state.cart.map((item)=>{
            return{
                ...item,
                quantity: item.id === action.payload ? item.quantity + 1 : item.quantity
            }
        })
        
        return {
            cart: updateCart
        }
    }else if(action.type === 'DECREMENT'){
        let updateCart = state.cart.map((item)=>{
            return{
                ...item,
                quantity: item.id === action.payload ? item.quantity <= 1 ? item.quantity : item.quantity - 1 : item.quantity
            }
        })

        return {
            cart: updateCart
        }
    }else if(action.type === "CLEAR_CART"){
        return{
            cart: []
        }
    } else {
        return state
    }
}

export default CartReducer